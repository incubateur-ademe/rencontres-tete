import bcrypt from 'bcrypt';
import prisma from '@/prisma';

const SALT_ROUNDS = 10;

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { motDePasse, userId } = req.body;

        try {

            const hashedPassword = await bcrypt.hash(motDePasse, SALT_ROUNDS);
            
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    motDePasse: hashedPassword
                },
            });

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
