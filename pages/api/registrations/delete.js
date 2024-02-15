import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method === 'DELETE') {
        const { userId, sessionId } = req.query;

        try {

            await prisma.registration.deleteMany({
                where: { userId: parseInt(userId), sessionId: parseInt(sessionId) },
            });

            res.json({ message: 'User supprimé avec succès' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Impossible de supprimer le user : ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
