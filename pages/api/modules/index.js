import prisma from '@/prisma';

export default async function handle(req, res) {
  const { pilier, tri, thematique, nom, region, departement, dateDebut } = req.query;

  let sessionWhere = {};
  // Construire les conditions pour les sessions
  if (region) sessionWhere.region = region;
  if (departement) sessionWhere.departement = departement;
  if (dateDebut) sessionWhere.dateDebut = { gte: new Date(dateDebut) };

  let queryOptions = {
    where: {},
    orderBy: tri ? [{ id: tri }] : [],
    include: {
      sessions: {
        where: sessionWhere,
        // Incluez cette ligne pour éviter d'exclure les modules sans sessions
        // lorsque aucun filtre spécifique de session n'est appliqué
        ...(Object.keys(sessionWhere).length === 0 && { where: undefined }),
      },
    },
  };

  // Filtres liés directement aux modules
  if (pilier) queryOptions.where.pilier = pilier;
  if (thematique) queryOptions.where.thematique = thematique;
  if (nom) queryOptions.where.nom = { contains: nom, mode: 'insensitive' };

  try {
    const modules = await prisma.module.findMany(queryOptions);
    res.json(modules); // Retourner tous les modules, y compris ceux sans sessions
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des modules' });
  }
}
