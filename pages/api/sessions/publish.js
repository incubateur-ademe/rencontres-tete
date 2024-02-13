import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { id } = req.body;

        try {
            const now = new Date()
            
            const updatedSession = await prisma.session.update({
                where: { id: parseInt(id) },
                data: {
                    status: 'publish',
                    lastUpdate: now
                }
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
