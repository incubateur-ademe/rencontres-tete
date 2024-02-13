import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { sessionId, ...data } = req.body;

        try {
            const now = new Date()
            
            const updatedSession = await prisma.session.update({
                where: { id: parseInt(sessionId) },
                data: {
                    ...data.sessionData,
                    lastUpdate: now,
                    metasSession: {
                        update: {
                            ...data.metasSessionData
                        },
                    },
                },
                include: { metasSession: true },
            });

            res.json(updatedSession);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
