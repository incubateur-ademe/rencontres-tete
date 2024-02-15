import prisma from '@/prisma';

export default async function handle(req, res) {
  const { id, passed, departement, status, region } = req.query;

  let queryOptions = {
    where: {},
    include: {
      module: true, // Inclure les détails du module lié à chaque session
    },
  };

  if (id) {
    queryOptions.where.moduleId = parseInt(id);
  }


  if (status == 'publish') {
    queryOptions.where.status = {
      not: 'brouillon',
    };
  }

  if (departement) {
    queryOptions.where.departement = departement;
  }

  if (region) {
    queryOptions.where.region = region;
  }

  if (passed === 'old') {
    queryOptions.where.dateDebut = {
      lt: new Date(),
    };
  } else if (passed === 'upcoming') {
    queryOptions.where.dateDebut = {
      gte: new Date(),
    };
  }

  try {
    const sessions = await prisma.session.findMany(queryOptions);

    // Transformer les sessions pour inclure le nom du module dans la réponse
    const transformedSessions = sessions.map(session => ({
      ...session,
      moduleName: session.module?.nom || 'Nom de module inconnu', // Utilisez un champ par défaut ou un message si le module est inexistant
    }));

    res.json(transformedSessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error.message);
    res.status(500).json({ error: "Impossible de récupérer les sessions" });
  }
}
