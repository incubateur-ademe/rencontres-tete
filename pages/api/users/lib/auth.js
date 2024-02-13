import bcrypt from 'bcrypt';
import prisma from '@/prisma';

async function verifyUser(email, motDePasse) {
    const user = await prisma.user.findUnique({
        where: { mail: email },
    });

    if (!user) {
        return { success: false, message: "Utilisateur non trouvé." };
    }

    const match = await bcrypt.compare(motDePasse, user.motDePasse);

    if (match) {
        return { success: true, user: user };
    } else {
        return { success: false, message: "Mot de passe incorrect." };
    }
}

export default async function handle(req, res) {
    const { mail, motDePasse } = req.query;

    const verify = await verifyUser(mail, motDePasse);

    res.json(verify);
}
