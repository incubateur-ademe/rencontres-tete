import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { id, ...data } = req.body;

        try {
            const now = new Date()

            let slug = data.moduleData.nom
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,]/g, "")
            .replace(/\s+/g, '-')
            .toLowerCase()
            
            const updatedModule = await prisma.module.update({
                where: { id: parseInt(id) },
                data: {
                    ...data.moduleData,
                    slug: slug,
                    lastUpdate: now,
                    metasModule: {
                        update: {
                            ...data.metasModuleData
                        },
                    },
                },
                include: { metasModule: true },
            });

            res.json(updatedModule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
