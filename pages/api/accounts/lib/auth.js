import bcrypt from 'bcrypt';
import prisma from '@/prisma';

async function verifyUser(email, motDePasse) {
    const user = await prisma.account.findUnique({
        where: { email: email },
    });

    if (!user) {
        return { success: false, message: "Utilisateur non trouvé." };
    }

    const match = await bcrypt.compare(motDePasse, user.password);

    if (match) {
        return { success: true, account: user };
    } else {
        return { success: false, message: "Mot de passe incorrect." };
    }
}

export default async function handle(req, res) {
    const { mail, motDePasse } = req.query;

    const verify = await verifyUser(mail, motDePasse);

    res.json(verify);
}
