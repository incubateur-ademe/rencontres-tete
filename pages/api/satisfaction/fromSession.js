import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour sérialiser correctement les BigInt
function serializeBigIntFields(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { sessionId } = req.query;

    try {
      // Récupération des satisfactions des utilisateurs
      const satisfaction = await prisma.satisfaction.findMany({
        where: {
          sessionId: sessionId ? parseInt(sessionId) : undefined,
        },
        include: {
          User: {
            select: {
              nom: true,
              prenom: true,
            },
          },
        },
      });

      const userSatisfactionWithRegistration = await Promise.all(
        satisfaction.map(async (satisfactionItem) => {
          const registration = await prisma.registration.findFirst({
            where: {
              sessionId: parseInt(sessionId),
              userId: satisfactionItem.userId, // Utiliser le userId pour obtenir les infos d'inscription
            },
            select: {
              mail: true,
              structure: true,
              fonction: true,
              typeFonction: true,
              ville: true,
            },
          });

          return {
            ...satisfactionItem,
            registration, // Ajouter les informations d'inscription
          };
        })
      );

      // Récupération des satisfactions des comptes spéciaux
      const accountSatisfaction = await prisma.accountSatisfaction.findMany({
        where: {
          sessionId: sessionId ? parseInt(sessionId) : undefined,
        },
        include: {
          Account: {
            select: {
              email: true,
              type: true,
            },
          },
        },
      });


      const accountSatisfactionWithRegistration = await Promise.all(
        accountSatisfaction.map(async (satisfactionItem) => {
          const registration = await prisma.accountRegistration.findFirst({
            where: {
              sessionId: parseInt(sessionId),
              accountId: satisfactionItem.accountId, // Utiliser le accountId pour obtenir les infos d'inscription
            },
            select: {
              mail: true,
              structure: true,
              fonction: true,
              typeFonction: true,
              ville: true,
            },
          });

          return {
            ...satisfactionItem,
            registration, // Ajouter les informations d'inscription
          };
        })
      );

      const combinedSatisfaction = [
        ...userSatisfactionWithRegistration,
        ...accountSatisfactionWithRegistration,
      ];

      // Combinaison des résultats
      // const combinedSatisfaction = [
      //   ...satisfaction.map(item => ({
      //     ...item,
      //     source: 'user', // Identifier la source de la satisfaction
      //   })),
      //   ...accountSatisfaction.map(item => ({
      //     ...item,
      //     source: 'account', // Identifier la source de la satisfaction
      //   })),
      // ];

      // Utilisation de la fonction serializeBigIntFields pour convertir correctement les BigInt
      res.status(200).json(serializeBigIntFields(combinedSatisfaction));
    }  catch (error) {
      console.error('Error fetching satisfaction:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la satisfaction.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
