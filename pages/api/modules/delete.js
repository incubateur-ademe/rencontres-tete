import prisma from '@/prisma'

export default async function handle(req, res) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            await prisma.metasModule.deleteMany({
                where: { moduleId: parseInt(id) },
            });

            await prisma.module.delete({
                where: { id: parseInt(id) },
            });

            res.json({ message: 'Module et MetasModule associés supprimés avec succès' });
        } catch (error) {
            res.status(500).json({ error: `Impossible de supprimer le module: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
