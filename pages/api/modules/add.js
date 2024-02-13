import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { moduleData, metasModuleData } = req.body;

        try {
            const now = new Date();
            
            // Créer un nouveau module avec MetasModule si les données sont fournies
            const newModule = await prisma.module.create({
                data: {
                    ...moduleData,
                    datePublication: now,
                    lastUpdate: now,
                    metasModule: metasModuleData ? {
                        create: {
                            ...metasModuleData,
                            // lastUpdate: now, // Ajoutez cette ligne si votre MetasModule a aussi un champ lastUpdate
                        },
                    } : undefined,
                },
                include: { metasModule: true },
            });

            res.json(newModule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
