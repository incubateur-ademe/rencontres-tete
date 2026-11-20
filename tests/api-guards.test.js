// Matrice d'accès des routes API : qui peut appeler quoi. Une route refusée ne
// doit jamais toucher la base.
import { describe, expect, it } from 'vitest';
import { prisma, as, call } from './helpers';

const routes = import.meta.glob('../pages/api/**/*.js');
const route = async (path) => (await routes[`../pages/api/${path}.js`]()).default;

// [route, méthode, paramètres]
const ADMIN_ONLY = [
  ['accounts/index', 'GET'],
  ['accounts/[id]', 'GET'],
  ['accounts/create', 'POST'],
  ['accounts/update', 'PUT'],
  ['accounts/delete', 'DELETE'],
  ['avis/save', 'POST'],
  ['cron/status', 'GET'],
  ['edit-emails/list', 'GET'],
  ['edit-emails/load', 'GET'],
  ['edit-emails/load-body', 'GET'],
  ['edit-emails/save', 'POST'],
  ['edit-emails/save-body', 'POST'],
  ['emails/toParticipants', 'POST'],
  ['faq/save', 'POST'],
  ['modules/add', 'POST'],
  ['modules/update', 'POST'],
  ['modules/delete', 'DELETE'],
  ['registrations/[id]', 'GET'],
  ['registrations/delete', 'DELETE'],
  ['registrations/updateRole', 'POST'],
  ['reviews/bySession', 'GET'],
  ['satisfaction/fromSession', 'GET'],
  ['satisfaction/getSatisfaction', 'GET'],
  ['satisfaction-after/fromSession', 'GET'],
  ['satisfaction-after/getSatisfaction', 'GET'],
  ['sessions/add', 'POST'],
  ['sessions/update', 'POST'],
  ['sessions/delete', 'DELETE'],
  ['sessions/publish', 'POST'],
  ['upload', 'POST'],
  ['users/[id]', 'GET'],
  ['users/findUser', 'GET'],
];

// Envoi d'emails et workflows : appel interne (cron, autres routes) ou admin.
const INTERNAL_OR_ADMIN = [
  ['emails/newAccount', 'POST'],
  ['emails/newPassword', 'POST'],
  ['emails/sessionAfter4Months', 'POST'],
  ['emails/sessionAfterDays', 'POST'],
  ['emails/sessionDays', 'POST'],
  ['emails/sessionRegister', 'POST'],
  ['emails/sessionWeeks', 'POST'],
  ['emails/welcome', 'POST'],
  ['workflow/workflowAfter', 'GET'],
  ['workflow/workflowAfter4Months', 'GET'],
  ['workflow/workflowDays', 'GET'],
  ['workflow/workflowWeeks', 'GET'],
];

// Routes d'un participant sur ses propres données. `params(id)` place l'id
// visé là où la route le lit.
const SELF_ONLY = [
  ['userSessions', 'GET', (id) => ({ query: { userId: id } })],
  ['users/[id]', 'GET', (id) => ({ query: { id } })],
  ['users/updateInfos', 'POST', (id) => ({ body: { id } })],
  ['users/delete', 'DELETE', (id) => ({ query: { id } })],
  ['users/lib/update-password', 'POST', (id) => ({ body: { userId: id, motDePasse: 'nouveau1', ancienMotDePasse: 'ancien1' } })],
  ['registrations/byUser', 'GET', (id) => ({ query: { userId: id } })],
  ['registrations/byUserSession', 'GET', (id) => ({ query: { userId: id, sessionId: '1' } })],
  ['registrations/add', 'POST', (id) => ({ body: { userId: id, sessionId: 1, type: 'user', inscriptionData: {} } })],
  ['registrations/cancel', 'POST', (id) => ({ body: { userId: id, sessionId: 1 } })],
  ['reviews/check', 'GET', (id) => ({ query: { userId: id, sessionId: '1' } })],
  ['reviews/add', 'POST', (id) => ({ body: { userId: id, sessionId: 1, note: 5, commentaire: 'Bien' } })],
  ['satisfaction/add', 'POST', (id) => ({ body: { userId: id, sessionId: 1, responses: {} } })],
  ['satisfaction/checkSatisfaction', 'GET', (id) => ({ query: { userId: id, sessionId: '1' } })],
  ['satisfaction-after/add', 'POST', (id) => ({ body: { userId: id, sessionId: 1, responses: {} } })],
  ['satisfaction-after/checkSatisfaction', 'GET', (id) => ({ query: { userId: id, sessionId: '1' } })],
];

describe.each(ADMIN_ONLY)('%s (%s) : admin seulement', (path, method) => {
  it.each([
    ['anonyme', {}],
    ['participant', as.user()],
    ['compte non admin', as.account()],
    ['borne de présence', as.kiosk()],
  ])('refuse : %s', async (_, cookies) => {
    const res = await call(await route(path), { method, cookies });
    expect(res.statusCode).toBe(401);
    expect(prisma.calls()).toBe(0);
  });
});

describe.each(INTERNAL_OR_ADMIN)('%s (%s) : appel interne ou admin', (path, method) => {
  it.each([
    ['anonyme', {}],
    ['participant', as.user()],
  ])('refuse : %s', async (_, cookies) => {
    const res = await call(await route(path), { method, cookies });
    expect(res.statusCode).toBe(401);
    expect(prisma.calls()).toBe(0);
  });
});

describe.each(SELF_ONLY)('%s (%s) : soi-même ou admin', (path, method, params) => {
  it('refuse un anonyme', async () => {
    const res = await call(await route(path), { method, ...params('7') });
    expect(res.statusCode).toBe(401);
    expect(prisma.calls()).toBe(0);
  });

  it('refuse un autre participant', async () => {
    const res = await call(await route(path), { method, cookies: as.user(8), ...params('7') });
    expect(res.statusCode).toBe(403);
    expect(prisma.calls()).toBe(0);
  });

  it('refuse un compte de même id (autre table)', async () => {
    const res = await call(await route(path), { method, cookies: as.account(7), ...params('7') });
    expect(res.statusCode).toBe(403);
    expect(prisma.calls()).toBe(0);
  });

  it.each([['le participant lui-même', as.user(7)], ['un admin', as.admin()], ['une DR', as.dr()]])('laisse passer %s', async (_, cookies) => {
    await call(await route(path), { method, cookies, ...params('7') });
    expect(prisma.calls()).toBeGreaterThan(0);
  });
});

describe('registrations/updatePresence : admin ou borne', () => {
  it.each([['anonyme', {}], ['participant', as.user()]])('refuse : %s', async (_, cookies) => {
    const res = await call(await route('registrations/updatePresence'), { method: 'PUT', cookies, body: { userId: 7, sessionId: 1, presence: true } });
    expect(res.statusCode).toBe(401);
    expect(prisma.calls()).toBe(0);
  });

  it('accepte la borne de présence', async () => {
    prisma.registration.updateMany.mockResolvedValue({ count: 1 });
    const res = await call(await route('registrations/updatePresence'), { method: 'PUT', cookies: as.kiosk(), body: { userId: 7, sessionId: 1, presence: true } });
    expect(res.statusCode).toBe(200);
    expect(prisma.registration.updateMany).toHaveBeenCalledWith({ where: { userId: 7, sessionId: 1 }, data: { presence: true } });
  });
});

describe('generate-badge : session requise', () => {
  it('refuse un anonyme', async () => {
    const res = await call(await route('generate-badge'), { method: 'POST' });
    expect(res.statusCode).toBe(401);
  });
});
