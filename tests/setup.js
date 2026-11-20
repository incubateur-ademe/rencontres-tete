import { beforeEach, vi } from 'vitest';
import { prisma } from './helpers';

// Aucun test ne touche une vraie base, un vrai SMTP ou le réseau.
process.env.JWT_SECRET = 'test-secret';
process.env.WEBSITE_URL = 'http://localhost:3000';

vi.mock('@/prisma', async () => ({ default: (await import('./helpers')).prisma }));
vi.mock('@/lib/prisma', async () => ({ default: (await import('./helpers')).prisma }));
vi.mock('node-fetch', () => ({
  default: vi.fn(async () => ({ ok: true, json: async () => ({}), text: async () => '' })),
}));
vi.mock('nodemailer', () => {
  const createTransport = vi.fn(() => ({ use: vi.fn(), sendMail: vi.fn(async () => ({})) }));
  return { default: { createTransport }, createTransport };
});

beforeEach(() => {
  prisma.reset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
