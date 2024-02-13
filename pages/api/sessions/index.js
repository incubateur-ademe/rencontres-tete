import prisma from '@/prisma'

export default async function handle(req, res) {
  const { id, passed } = req.query;

  let queryOptions = {
    where: {},
  };

  // Filtre basé sur l'ID du module
  if (id) {
    queryOptions.where.moduleId = parseInt(id);
  }

  // Ajoute une condition basée sur si la session est passée ou à venir
  if (passed === 'old') {
    queryOptions.where.dateDebut = {
      lt: new Date(), // 'lt' signifie 'less than' (inférieur à)
    };
  } else if (passed === 'upcoming') {
    queryOptions.where.dateDebut = {
      gte: new Date(), // 'gte' signifie 'greater than or equal' (supérieur ou égal à)
    };
  }

  const sessions = await prisma.session.findMany(queryOptions);
  res.json(sessions);
}
