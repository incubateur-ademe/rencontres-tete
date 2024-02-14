import bcrypt from 'bcrypt';
import prisma from '@/prisma';
const crypto = require('crypto');

function generatePassword(length = 10) {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '0')
        .replace(/\//g, '0')
        .substring(0, length);
}

const SALT_ROUNDS = 10;

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { mail } = req.body;

        try {

            const newPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            
            const updatedUser = await prisma.user.update({
                where: { mail: mail },
                data: {
                    motDePasse: hashedPassword
                },
            });

            // envoyer mail avec le nouveau mdp : newPassword

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
