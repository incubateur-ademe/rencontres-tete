import prisma from '@/prisma';

export default async function handle(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { pilier, nom, thematique } = req.query;

  let queryOptions = {
    where: {},
    orderBy: { id: 'asc' }, // Trie par ID par défaut
  };

  // Appliquer des filtres optionnels
  if (pilier) queryOptions.where.pilier = { contains: pilier, mode: 'insensitive' };
  if (nom) queryOptions.where.nom = { contains: nom, mode: 'insensitive' };
  if (thematique) queryOptions.where.thematique = { contains: thematique, mode: 'insensitive' };

  try {
    // Récupérer tous les modules filtrés
    const modules = await prisma.module.findMany(queryOptions);

    // Regrouper par pilier
    const groupedByPilier = modules.reduce((acc, module) => {
      const { pilier } = module;
      if (!acc[pilier]) {
        acc[pilier] = [];
      }
      acc[pilier].push(module);
      return acc;
    }, {});

    return res.status(200).json(groupedByPilier);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des modules' });
  }
}
