import jwt from 'jsonwebtoken';
import { vi } from 'vitest';

// Client Prisma factice : prisma.<modèle>.<méthode> est un vi.fn créé à la
// demande. findMany renvoie [], le reste null, sauf réglage dans le test.
const models = {};
export const prisma = new Proxy({}, {
  get(_, model) {
    if (typeof model === 'symbol' || model === 'then') return undefined;
    if (model === 'reset') return () => { for (const k in models) delete models[k]; };
    if (model === 'calls') return () => Object.values(models).flatMap((m) => Object.values(m)).reduce((n, fn) => n + fn.mock.calls.length, 0);
    models[model] ??= new Proxy({}, {
      get(target, method) {
        if (typeof method === 'symbol' || method === 'then') return undefined;
        target[method] ??= vi.fn(async () => (method === 'findMany' ? [] : null));
        return target[method];
      },
    });
    return models[model];
  },
});

// Cookies de session, tels que posés par setSessionCookie à la connexion.
const sign = (claims) => jwt.sign(claims, process.env.JWT_SECRET);
export const as = {
  admin: () => ({ auth: sign({ account: true, id: 1, type: 'Administrateur' }) }),
  dr: () => ({ auth: sign({ account: true, id: 2, type: 'DR' }) }),
  account: (id = 7) => ({ auth: sign({ account: true, id, type: 'Intervenant' }) }),
  user: (id = 7) => ({ auth: sign({ id, mail: `u${id}@test.fr` }) }),
  kiosk: () => ({ auth: sign({ id: 115 }) }),
};

// Appelle un handler de route API Next avec une requête/réponse minimales.
export async function call(handler, { method = 'GET', query = {}, body = {}, cookies = {}, headers = {}, ip = '1.2.3.4' } = {}) {
  const req = { method, query, body, cookies, headers: { 'x-forwarded-for': ip, ...headers }, socket: {} };
  const res = {
    statusCode: 200, body: undefined, headers: {}, location: undefined,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    send(data) { this.body = data; return this; },
    end(data) { this.body ??= data; return this; },
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
    redirect(code, url) { this.statusCode = code; this.location = url; return this; },
  };
  await handler(req, res);
  return res;
}
