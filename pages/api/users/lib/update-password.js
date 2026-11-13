import bcrypt from 'bcrypt';
import prisma from '@/prisma';
import { requireActAs, stripPasswords } from '@/utils/auth';

const SALT_ROUNDS = 10;

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { motDePasse, userId, type } = req.body;

        if (!requireActAs(req, res, userId, type == "special")) return;

        try {

            const hashedPassword = await bcrypt.hash(motDePasse, SALT_ROUNDS);

            if(type == "special"){
                const updatedUser = await prisma.account.update({
                    where: { id: parseInt(userId) },
                    data: {
                        password: hashedPassword
                    },
                });
    
                res.json(stripPasswords(updatedUser));
            } else {
                const updatedUser = await prisma.user.update({
                    where: { id: parseInt(userId) },
                    data: {
                        motDePasse: hashedPassword
                    },
                });
    
                res.json(stripPasswords(updatedUser));
            }
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
