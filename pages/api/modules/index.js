import prisma from '@/prisma';

export default async function handle(req, res) {
  const { pilier, tri, tricodes, thematique, nom, region, departement, dateDebut } = req.query;

  let sessionWhere = {};
  // Construire les conditions pour les sessions
  if (region) sessionWhere.region = region;
  if (departement) sessionWhere.departement = departement;
  if (dateDebut) sessionWhere.dateDebut = { gte: new Date(dateDebut) };

  let queryOptions = {
    where: {},
    orderBy: tri ? [{ id: tri }] : tricodes ? [{ code: tricodes }] : [],
    include: {
      sessions: {
        where: sessionWhere,
      },
    },
  };

  if (region) {
    queryOptions.where.sessions = {
      some: sessionWhere,
    };
  }

  if (departement) {
    queryOptions.where.sessions = {
      some: sessionWhere,
    };
  }

  if (dateDebut) {
    queryOptions.where.sessions = {
      some: sessionWhere,
    };
  }

  // Filtres liés directement aux modules
  if (pilier) queryOptions.where.pilier = { contains: pilier, mode: 'insensitive' };
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
