import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
    
    const { inscriptionData, userId, sessionId } = req.body;

    try {
        const now = new Date();

        const newRegistration = await prisma.registration.create({
            data: {
                ...inscriptionData,
                deleted: false,
                user: {
                    connect: { id: parseInt(userId) },
                },
                session: {
                    connect: { id: parseInt(sessionId) },
                }
            }
        });

        res.json(newRegistration);
    } catch (error) {
        res.status(500).json({ error: `Impossible de créer l'enregistrement : ${error.message}` });
    }
}
