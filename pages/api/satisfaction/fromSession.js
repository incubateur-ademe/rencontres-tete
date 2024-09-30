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
      console.log("Session ID reçu : ", sessionId);

      // Récupérer les satisfactions des utilisateurs
      const userSatisfaction = await prisma.satisfaction.findMany({
        where: {
          sessionId: sessionId ? parseInt(sessionId) : undefined,
        },
        include: {
          User: { // Inclure les informations de l'utilisateur
            select: {
              nom: true,
              prenom: true,
            },
          },
          Session: true, // Inclure la session si nécessaire
        },
      });

      // Récupérer les satisfactions des comptes
      const accountSatisfaction = await prisma.accountSatisfaction.findMany({
        where: {
          sessionId: sessionId ? parseInt(sessionId) : undefined,
        },
        include: {
          Account: { // Inclure les informations du compte
            select: {
              email: true,
              type: true,
            },
          },
          Session: true, // Inclure la session si nécessaire
        },
      });

      // Récupérer les informations d'inscription associées pour chaque utilisateur
      const userSatisfactionWithRegistration = await Promise.all(
        userSatisfaction.map(async (satisfactionItem) => {
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
      

      // Récupérer les informations d'inscription associées pour chaque compte
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

      // Combiner les résultats des deux sources (utilisateurs et comptes)
      const combinedSatisfaction = [
        ...userSatisfactionWithRegistration,
        ...accountSatisfactionWithRegistration,
      ];

      console.log("Satisfactions récupérées : ", satisfaction);

      // Utilisation de la fonction serializeBigIntFields pour convertir correctement les BigInt
      res.status(200).json(serializeBigIntFields(combinedSatisfaction));
    } catch (error) {
      console.error('Error fetching satisfaction:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la satisfaction.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
