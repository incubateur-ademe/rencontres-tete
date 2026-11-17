import { describe, expect, it } from 'vitest';
import { rateLimit } from '@/utils/rateLimit';
import { call } from './helpers';

// Chaque test prend son propre nom de compteur : la Map du module est partagée.
const hit = (name, ip, xff) => call((req, res) => res.json(rateLimit(req, res, name, 2, 60_000)), {
  headers: xff ? { 'x-forwarded-for': xff } : {}, ip,
});

describe('rateLimit', () => {
  it('répond 429 au-delà du maximum', async () => {
    expect((await hit('a', '1.1.1.1')).body).toBe(true);
    expect((await hit('a', '1.1.1.1')).body).toBe(true);
    const res = await hit('a', '1.1.1.1');
    expect(res.statusCode).toBe(429);
  });

  it('compte par IP et par nom', async () => {
    await hit('b', '1.1.1.1');
    await hit('b', '1.1.1.1');
    expect((await hit('b', '2.2.2.2')).statusCode).toBe(200);
    expect((await hit('c', '1.1.1.1')).statusCode).toBe(200);
  });

  it('prend la dernière IP de X-Forwarded-For (posée par le proxy)', async () => {
    // Le client change l'entrée qu'il contrôle : même compteur.
    await hit('d', null, 'spoof-1, 9.9.9.9');
    await hit('d', null, 'spoof-2, 9.9.9.9');
    expect((await hit('d', null, 'spoof-3, 9.9.9.9')).statusCode).toBe(429);
  });
});
