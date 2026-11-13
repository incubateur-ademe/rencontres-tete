import bcrypt from 'bcrypt';
import prisma from '@/prisma';
import { setSessionCookie } from '@/utils/session';
import { rateLimit } from '@/utils/rateLimit';

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { mail, motDePasse } = req.body;

    // Par IP, et par compte visé : une attaque répartie sur plusieurs IP
    // reste limitée. Contrepartie : un compte attaqué est bloqué 15 min.
    if (!rateLimit(req, res, 'login', 10, 15 * 60 * 1000)) return;
    if (!rateLimit(req, res, 'login-mail', 20, 15 * 60 * 1000, String(mail).toLowerCase())) return;
    const user = mail && motDePasse
        ? await prisma.user.findUnique({ where: { mail } })
        : null;

    if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
        res.status(401).json({ success: false, message: 'Identifiant ou mot de passe invalide(s)' });
        return;
    }

    setSessionCookie(res, { mail: user.mail, id: user.id });

    res.status(200).json({ success: true, id: user.id });
}
