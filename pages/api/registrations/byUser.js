import prisma from '@/prisma';

export default async function handle(req, res) {
  const { userId, status } = req.query;

  let dateCondition = {};
  let now = new Date();

  if (status) {
    if (status === 'upcoming') {
      dateCondition = {
        dateDebut: {
          gt: now,
        },
      };
    } else if (status === 'old') {
      dateCondition = {
        dateDebut: {
          lt: now,
        },
      };
    }
  }

  let queryOptions = {
    where: {
      userId: parseInt(userId),
      // Supposons ici que chaque inscription a une session directement liée
      session: dateCondition,
      deleted: false
    },
    include: {
      session: {
        include: {
          module: true // Inclure le module via la session
        }
      },
    },
  };

  try {
    const registrations = await prisma.registration.findMany(queryOptions);
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des modules' });
  }
}
