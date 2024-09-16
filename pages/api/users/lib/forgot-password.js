import bcrypt from 'bcrypt';
import prisma from '@/prisma';
const crypto = require('crypto');
import fetch from 'node-fetch';

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

            // Chercher d'abord dans la table user
            let updatedUser;
            try {
                updatedUser = await prisma.user.update({
                    where: { mail: mail },
                    data: {
                        motDePasse: hashedPassword
                    },
                });
            } catch (userError) {
                // Si l'email n'est pas trouvé dans user, chercher dans account
                let updatedAccount;
                try {
                    updatedAccount = await prisma.account.update({
                        where: { email: mail },
                        data: {
                            password: hashedPassword
                        },
                    });

                    if (!updatedAccount) {
                        // Si l'email n'est pas trouvé dans account non plus
                        throw new Error('Email not found in both user and account.');
                    }

                    // Envoyer le mail avec le nouveau mot de passe
                    await fetch(`${process.env.WEBSITE_URL}/api/emails/newPassword`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: mail,
                            password: newPassword
                        })
                    });

                    // Retourner la réponse avec l'updatedAccount
                    return res.json(updatedAccount);
                } catch (accountError) {
                    // Gérer les erreurs liées à la table account
                    return res.status(500).json({ error: accountError.message });
                }
            }

            // Envoyer le mail avec le nouveau mot de passe
            await fetch(`${process.env.WEBSITE_URL}/api/emails/newPassword`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: mail,
                    password: newPassword
                })
            });

            // Retourner la réponse avec l'updatedUser
            return res.json(updatedUser);

        } catch (error) {
            // Gérer les autres erreurs
            return res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
