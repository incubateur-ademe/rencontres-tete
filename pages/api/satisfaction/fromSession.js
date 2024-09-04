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

      // Combinaison des résultats
      const combinedSatisfaction = [
        ...satisfaction.map(item => ({
          ...item,
          source: 'user', // Identifier la source de la satisfaction
        })),
        ...accountSatisfaction.map(item => ({
          ...item,
          source: 'account', // Identifier la source de la satisfaction
        })),
      ];

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
