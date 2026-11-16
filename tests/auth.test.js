import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';
import {
  canActAs, getSession, internalHeaders, isAdmin, isPresenceKiosk,
  requireInternalOrAdmin, stripPasswords,
} from '@/utils/auth';
import { signResetToken } from '@/utils/session';
import { as, call } from './helpers';

const req = (cookies = {}, headers = {}) => ({ cookies, headers });

describe('getSession', () => {
  it('lit le cookie auth signé', () => {
    expect(getSession(req(as.user(7)))).toMatchObject({ id: 7 });
  });

  it.each([
    ['sans cookie', {}],
    ['jeton forgé', { auth: jwt.sign({ account: true, id: 1, type: 'Administrateur' }, 'autre-secret') }],
    ['jeton expiré', { auth: jwt.sign({ id: 7, exp: Math.floor(Date.now() / 1000) - 10 }, process.env.JWT_SECRET) }],
    ['jeton d’appel interne', { auth: jwt.sign({ internal: true }, process.env.JWT_SECRET) }],
    ['jeton de réinitialisation', { auth: signResetToken({ id: 1, account: true, hash: 'h' }) }],
  ])('refuse : %s', (_, cookies) => {
    expect(getSession(req(cookies))).toBeNull();
  });
});

describe('isAdmin', () => {
  it.each([
    [{ account: true, type: 'Administrateur', id: 3 }, true],
    [{ account: true, type: 'DR', id: 3 }, true],
    [{ account: true, type: 'Intervenant', id: 10 }, true],
    [{ account: true, type: 'Intervenant', id: 3 }, false],
    // Un participant (table User) n'est jamais admin, même avec l'id 10.
    [{ id: 10 }, false],
    [{ id: 3, type: 'Administrateur' }, false],
    [null, false],
  ])('%j → %s', (user, expected) => {
    expect(isAdmin(user)).toBe(expected);
  });
});

describe('canActAs', () => {
  const user7 = { id: 7 };
  const account7 = { id: 7, account: true, type: 'Intervenant' };

  it('agit pour soi-même', () => {
    expect(canActAs(user7, '7', false)).toBe(true);
    expect(canActAs(account7, 7, true)).toBe(true);
  });

  it('pas pour un autre id', () => {
    expect(canActAs(user7, '8', false)).toBe(false);
  });

  it('pas pour le même id dans l’autre table', () => {
    expect(canActAs(user7, '7', true)).toBe(false);
    expect(canActAs(account7, '7', false)).toBe(false);
  });

  it.each(['7.0', '0x7', '7e0', ' 7', '', undefined])('refuse un id non canonique : %j', (id) => {
    expect(canActAs(user7, id, false)).toBe(false);
  });

  it('un admin agit pour tout le monde', () => {
    expect(canActAs({ id: 1, account: true, type: 'Administrateur' }, '42', false)).toBe(true);
  });

  it('pas sans session', () => {
    expect(canActAs(null, '7', false)).toBe(false);
  });
});

describe('isPresenceKiosk', () => {
  it('participant 115 seulement', () => {
    expect(isPresenceKiosk({ id: 115 })).toBe(true);
    expect(isPresenceKiosk({ id: 115, account: true })).toBe(false);
    expect(isPresenceKiosk({ id: 116 })).toBe(false);
  });
});

describe('stripPasswords', () => {
  it('retire password et motDePasse à toute profondeur', () => {
    const data = [{ id: 1, motDePasse: 'h', registrations: [{ account: { email: 'a', password: 'h' } }] }];
    expect(stripPasswords(data)).toEqual([{ id: 1, registrations: [{ account: { email: 'a' } }] }]);
  });
});

describe('requireInternalOrAdmin', () => {
  it('accepte le jeton interne dans l’en-tête', async () => {
    const res = await call((rq, rs) => rs.json(requireInternalOrAdmin(rq, rs)), { headers: internalHeaders() });
    expect(res.body).toMatchObject({ internal: true });
  });

  it('refuse une session de participant', async () => {
    const res = await call((rq, rs) => requireInternalOrAdmin(rq, rs), { cookies: as.user() });
    expect(res.statusCode).toBe(401);
  });

  it('refuse un jeton interne posé en cookie', async () => {
    const res = await call((rq, rs) => requireInternalOrAdmin(rq, rs), { cookies: { auth: internalHeaders()['x-internal-token'] } });
    expect(res.statusCode).toBe(401);
  });
});
