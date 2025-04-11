import prisma from '@/prisma';

export default async function handle(req, res) {
  const {
    id,
    tri,
    tricodes,
    passed,
    departement,
    status,
    region,
    module,
    pilier,
    nom,
    thematique,
    dateDebut
  } = req.query;

  let queryOptions = {
    where: {
      ...(status === 'publish' && { status: { not: 'brouillon' } }),
      ...(status === 'brouillon' && { status: { not: 'publish' } }),
      ...(departement && { departement }),
      ...(region && { region }),
      ...(dateDebut && { dateDebut: { gte: new Date(dateDebut) } }),
      ...(passed === 'old' && { dateDebut: { lt: new Date() } }),
      ...(passed === 'upcoming' && { dateDebut: { gte: new Date() } }),
      ...(id && { moduleId: parseInt(id) }),
      module: {
        ...(pilier && { pilier }),
        ...(thematique && { thematique }),
        ...(nom && { nom: { contains: nom, mode: 'insensitive' } })
      }
    },
    orderBy: [{ dateDebut: 'asc' }],
    include: {
      module: {
        include: {
          metasModule: true
        }
      }
    }
  };

  try {
    const sessions = await prisma.session.findMany(queryOptions);

    const transformed = sessions.map(session => ({
      ...session,
      moduleName: session.module?.nom || 'Nom de module inconnu',
    }));

    res.json(transformed);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error.message);
    res.status(500).json({ error: "Impossible de récupérer les sessions" });
  }
}
