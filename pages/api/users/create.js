import bcrypt from 'bcrypt';
import prisma from '@/prisma';

const SALT_ROUNDS = 10;

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { userData } = req.body;
        const { motDePasse } = userData;

        try {
            const hashedPassword = await bcrypt.hash(motDePasse, SALT_ROUNDS);
            
            userData.motDePasse = hashedPassword;

            const newUser = await prisma.user.create({
                data: userData,
            });

            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: `Impossible de créer le compte: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
