import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { moduleData, metasModuleData } = req.body;

        try {
            const now = new Date();

            let slug = moduleData.nom
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,]/g, "")
            .replace(/\s+/g, '-')
            .toLowerCase()

            const newModule = await prisma.module.create({
                data: {
                    ...moduleData,
                    slug: slug,
                    datePublication: now,
                    lastUpdate: now,
                    metasModule: metasModuleData ? {
                        create: {
                            ...metasModuleData,
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
