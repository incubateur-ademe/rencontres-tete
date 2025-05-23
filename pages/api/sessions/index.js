import prisma from '@/lib/prisma';

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

  const now = new Date();

  // Préparation du filtre par date
  const dateConditions = {};

  if (passed === 'old') {
    dateConditions.lt = now;
  } else if (passed === 'upcoming') {
    dateConditions.gte = now;
  }

  if (dateDebut) {
    // On ajoute la condition du query string
    dateConditions.gte = new Date(dateDebut);
  }

  const whereClause = {
    ...(status && { status }), // 'publish' ou 'brouillon'
    ...(departement && { departement }),
    ...(region && { region }),
    ...(id && { moduleId: parseInt(id) }),
    ...(module && { moduleId: parseInt(module) }),
    ...(Object.keys(dateConditions).length > 0 && { dateDebut: dateConditions }),
    module: {
      ...(pilier && { pilier }),
      ...(thematique && { thematique }),
      ...(nom && { nom: { contains: nom, mode: 'insensitive' } })
    }
  };

  const queryOptions = {
    where: whereClause,
    orderBy: [{ dateDebut: tri === 'asc' ? 'asc' : 'desc' }],
    include: {
      module: {
        include: {
          metasModule: true
        }
      },
      metasSession: true
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
