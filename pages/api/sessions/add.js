import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        res.status(401).json({ error: 'Unauthorized: Invalid API key' });
        return;
    }    

    const { sessionData, metasSessionData, moduleId } = req.body;

    try {
        const now = new Date();
        let dateDebut = new Date(metasSessionData.dateHoraires);

        const newSession = await prisma.session.create({
            data: {
                ...sessionData,
                dateDebut: dateDebut,
                datePublication: now,
                lastUpdate: now,
                module: {
                    connect: { id: parseInt(moduleId) },
                },
                metasSession: metasSessionData ? {
                    create: {
                        ...metasSessionData,
                    },
                } : undefined,
            },
            include: { metasSession: true },
        });

        res.json(newSession);
    } catch (error) {
        res.status(500).json({ error: `Impossible de créer la session: ${error.message}` });
    }
}
