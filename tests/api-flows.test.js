// Parcours métier des routes API, base et emails simulés.
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSession } from '@/utils/auth';
import { signResetToken } from '@/utils/session';
import { as, call, prisma } from './helpers';
import userLogin from '@/pages/api/users/lib/jwt';
import accountLogin from '@/pages/api/accounts/lib/jwt';
import forgotPassword from '@/pages/api/users/lib/forgot-password';
import resetPassword from '@/pages/api/users/lib/reset-password';
import updatePassword from '@/pages/api/users/lib/update-password';
import createUser from '@/pages/api/users/create';
import userById from '@/pages/api/users/[id]';
import addRegistration from '@/pages/api/registrations/add';
import bySession from '@/pages/api/registrations/bySession';
import workflowDays from '@/pages/api/workflow/workflowDays';

const hash = bcrypt.hashSync('secret1', 4);
let ip = 0;
const fresh = () => `10.0.0.${++ip}`; // une IP par test : le rate limit est global au module

// Cookie `auth` tiré d'un en-tête Set-Cookie.
const authCookie = (res) => ({ auth: /auth=([^;]+)/.exec(res.headers['set-cookie'])[1] });
const sentEmails = () => fetch.mock.calls.map(([url, opts]) => ({ url, ...JSON.parse(opts.body) }));

beforeEach(() => fetch.mockClear());

describe('connexion participant', () => {
  it('pose une session httpOnly sur un bon mot de passe', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 7, mail: 'a@b.fr', motDePasse: hash });
    const res = await call(userLogin, { method: 'POST', body: { mail: 'a@b.fr', motDePasse: 'secret1' }, ip: fresh() });
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toMatch(/HttpOnly/);
    expect(getSession({ cookies: authCookie(res) })).toMatchObject({ id: 7, mail: 'a@b.fr' });
    expect(getSession({ cookies: authCookie(res) }).account).toBeUndefined();
  });

  it.each([
    ['mauvais mot de passe', { mail: 'a@b.fr', motDePasse: 'faux' }, { id: 7, motDePasse: hash }],
    ['adresse inconnue', { mail: 'x@b.fr', motDePasse: 'secret1' }, null],
    ['champs manquants', {}, null],
  ])('401 : %s', async (_, body, user) => {
    prisma.user.findUnique.mockResolvedValue(user);
    const res = await call(userLogin, { method: 'POST', body, ip: fresh() });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('bloque après 10 tentatives depuis la même IP', async () => {
    const from = fresh();
    for (let i = 0; i < 10; i++) await call(userLogin, { method: 'POST', body: {}, ip: from });
    const res = await call(userLogin, { method: 'POST', body: {}, ip: from });
    expect(res.statusCode).toBe(429);
  });
});

describe('connexion back-office', () => {
  it('pose les claims du compte lus en base', async () => {
    prisma.account.findUnique.mockResolvedValue({ id: 2, email: 'dr@b.fr', password: hash, type: 'DR', regions: ['FR-ARA'], modules: [] });
    const res = await call(accountLogin, { method: 'POST', body: { mail: 'dr@b.fr', motDePasse: 'secret1', type: 'Administrateur' }, ip: fresh() });
    expect(getSession({ cookies: authCookie(res) })).toMatchObject({ account: true, id: 2, type: 'DR', regions: ['FR-ARA'] });
  });

  it('401 pour un compte sans mot de passe', async () => {
    prisma.account.findUnique.mockResolvedValue({ id: 2, email: 'dr@b.fr', password: null });
    const res = await call(accountLogin, { method: 'POST', body: { mail: 'dr@b.fr', motDePasse: 'x' }, ip: fresh() });
    expect(res.statusCode).toBe(401);
  });
});

describe('mot de passe oublié', () => {
  it('même réponse, que l’adresse ait un compte ou non', async () => {
    const unknown = await call(forgotPassword, { method: 'POST', body: { mail: 'x@b.fr' }, ip: fresh() });
    expect(fetch).not.toHaveBeenCalled();

    prisma.user.findUnique.mockResolvedValue({ id: 7, mail: 'a@b.fr', motDePasse: hash });
    const known = await call(forgotPassword, { method: 'POST', body: { mail: 'a@b.fr' }, ip: fresh() });

    expect(known.statusCode).toBe(unknown.statusCode);
    expect(known.body).toEqual(unknown.body);
    expect(sentEmails()).toEqual([expect.objectContaining({ email: 'a@b.fr', resetUrl: expect.stringContaining('token=') })]);
  });

  it('le lien ne sert qu’une fois', async () => {
    const user = { id: 7, mail: 'a@b.fr', motDePasse: hash };
    prisma.user.findUnique.mockImplementation(async () => user);
    prisma.user.updateMany.mockImplementation(async ({ data }) => Object.assign(user, data));
    const token = signResetToken({ id: 7, account: false, hash });

    const first = await call(resetPassword, { query: { token } });
    expect(first.location).toBe('/connexion?reset=ok');
    const [{ password }] = sentEmails();
    expect(await bcrypt.compare(password, user.motDePasse)).toBe(true);

    const second = await call(resetPassword, { query: { token } });
    expect(second.location).toBe('/connexion?reset=invalide');
  });

  it('refuse un cookie de session utilisé comme jeton de réinitialisation', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 7, motDePasse: hash });
    const res = await call(resetPassword, { query: { token: as.user(7).auth } });
    expect(res.location).toBe('/connexion?reset=invalide');
    expect(prisma.user.updateMany).not.toHaveBeenCalled();
  });

  it('change aussi le compte admin/DR au même email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 7, mail: 'dr@b.fr', motDePasse: hash });
    const token = signResetToken({ id: 7, account: false, hash });

    await call(resetPassword, { query: { token } });

    const [{ password }] = sentEmails();
    const [[{ where, data }]] = prisma.account.updateMany.mock.calls;
    expect(where).toEqual({ email: 'dr@b.fr' });
    expect(await bcrypt.compare(password, data.password)).toBe(true);
    expect(prisma.user.updateMany).toHaveBeenCalledWith({ where: { mail: 'dr@b.fr' }, data: { motDePasse: data.password } });
  });
});

describe('changement de mot de passe', () => {
  const body = { userId: '7', motDePasse: 'nouveau1' };

  it('exige le mot de passe actuel', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 7, motDePasse: hash });
    const res = await call(updatePassword, { method: 'POST', cookies: as.user(7), body: { ...body, ancienMotDePasse: 'faux' } });
    expect(res.statusCode).toBe(403);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('enregistre le nouveau hash, sans le renvoyer', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 7, motDePasse: hash });
    prisma.user.update.mockImplementation(async ({ data }) => ({ id: 7, ...data }));
    const res = await call(updatePassword, { method: 'POST', cookies: as.user(7), body: { ...body, ancienMotDePasse: 'secret1' } });
    expect(res.body).toEqual({ id: 7 });
    const { motDePasse } = prisma.user.update.mock.calls[0][0].data;
    expect(await bcrypt.compare('nouveau1', motDePasse)).toBe(true);
  });
});

describe('inscription', () => {
  it('ne garde que les champs du formulaire et hashe le mot de passe', async () => {
    prisma.user.create.mockImplementation(async ({ data }) => ({ id: 9, ...data }));
    const res = await call(createUser, {
      method: 'POST',
      body: { userData: { nom: 'N', prenom: 'P', mail: 'p@b.fr', motDePasse: 'secret1', id: 1, type: 'Administrateur' } },
    });
    expect(res.statusCode).toBe(201);
    const { data } = prisma.user.create.mock.calls[0][0];
    expect(data).not.toHaveProperty('id');
    expect(data).not.toHaveProperty('type');
    expect(await bcrypt.compare('secret1', data.motDePasse)).toBe(true);
    expect(res.body).not.toHaveProperty('motDePasse');
    expect(sentEmails()).toEqual([expect.objectContaining({ url: expect.stringMatching(/emails\/welcome$/), email: 'p@b.fr' })]);
  });

  it('400 si le mot de passe est trop court', async () => {
    const res = await call(createUser, { method: 'POST', body: { userData: { mail: 'p@b.fr', motDePasse: '123' } } });
    expect(res.statusCode).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

describe('profil', () => {
  it('ne renvoie jamais le hash du mot de passe', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 7, mail: 'a@b.fr', motDePasse: hash }]);
    const res = await call(userById, { query: { id: '7' }, cookies: as.user(7) });
    expect(res.body).toEqual([{ id: 7, mail: 'a@b.fr' }]);
  });
});

describe('inscription à une rencontre', () => {
  const session = (status) => ({
    id: 1, status, dateDebut: '2026-12-01T00:00:00Z',
    module: { nom: 'Rencontre' },
    metasSession: { programmeSession: [{ horaires: 'Jour 1 : 09h30 - 17h00' }], dateHoraires: '2026-12-01', nombreJours: 1 },
  });
  const register = (inscriptionData) => call(addRegistration, {
    method: 'POST', cookies: as.user(7),
    body: { userId: '7', sessionId: '1', type: 'user', inscriptionData },
  });

  it.each(['closed', 'brouillon'])('403 sur une session %s', async (status) => {
    prisma.session.findUnique.mockResolvedValue(session(status));
    const res = await register({ transport: 'train' });
    expect(res.statusCode).toBe(403);
    expect(prisma.registration.create).not.toHaveBeenCalled();
  });

  it('écarte les champs réservés et les objets imbriqués', async () => {
    prisma.session.findUnique.mockResolvedValue(session('published'));
    prisma.user.findUnique.mockResolvedValue({ id: 7, prenom: 'P', mail: 'a@b.fr' });
    prisma.registration.create.mockResolvedValue({ id: 3 });

    const res = await register({ transport: 'train', role: 'organisateur', presence: true, deleted: true, userId: 99, user: { create: {} } });

    expect(res.statusCode).toBe(200);
    const { data } = prisma.registration.create.mock.calls[0][0];
    expect(data).toEqual({
      transport: 'train', deleted: false,
      user: { connect: { id: 7 } }, session: { connect: { id: 1 } },
    });
    expect(sentEmails()).toEqual([expect.objectContaining({ email: 'a@b.fr', dateRencontre: '01/12/2026', firstDayStartTime: '09h30' })]);
  });
});

describe('inscrits d’une session', () => {
  const rows = [{ id: 1, deleted: false, user: { mail: 'a@b.fr', motDePasse: hash } }];

  it('public : seulement le statut des inscriptions', async () => {
    prisma.registration.findMany.mockResolvedValue(rows);
    const res = await call(bySession, { query: { sessionId: '1' } });
    expect(res.body).toEqual([{ deleted: false }]);
  });

  it('admin : le détail, sans mot de passe', async () => {
    prisma.registration.findMany.mockResolvedValue(rows);
    const res = await call(bySession, { query: { sessionId: '1' }, cookies: as.admin() });
    expect(res.body[0].user).toEqual({ mail: 'a@b.fr' });
  });
});

describe('relance J-3 (cron)', () => {
  it('cherche les sessions dans 3 jours et écrit à chaque inscrit, copie cachée au premier seulement', async () => {
    vi.useFakeTimers({ now: new Date(2026, 10, 16, 0, 0), toFake: ['Date'] });
    prisma.session.findMany.mockResolvedValue([{
      dateDebut: new Date(2026, 10, 19),
      module: { nom: 'Rencontre' },
      metasSession: { programmeSession: [{ horaires: '09h30 - 17h00' }], nombreJours: 1 },
      registrations: [{ user: { prenom: 'A', mail: 'a@b.fr' } }],
      accountRegistrations: [{ account: { email: 'dr@b.fr' } }],
    }]);

    const res = await call(workflowDays, { headers: { 'x-internal-token': (await import('@/utils/auth')).internalHeaders()['x-internal-token'] } });
    vi.useRealTimers();

    expect(res.statusCode).toBe(200);
    const { gte, lt } = prisma.session.findMany.mock.calls[0][0].where.dateDebut;
    expect(gte).toEqual(new Date(2026, 10, 19, 0, 0, 0, 0));
    expect(lt).toEqual(new Date(2026, 10, 19, 23, 59, 59, 999));
    expect(sentEmails()).toEqual([
      expect.objectContaining({ email: 'a@b.fr', prenom: 'A', firstDayStartTime: '09h30', isFirstEmailInLoop: true }),
      expect.objectContaining({ email: 'dr@b.fr', prenom: 'dr', isFirstEmailInLoop: false }),
    ]);
  });
});
