import prisma from '@/prisma';

export default async function handle(req, res) {
  const { userId } = req.query;

  let queryOptions = {
    where: {
        userId: parseInt(userId)
    },
    // orderBy: tri ? [{ id: tri }] : [],
  };


  try {
    const registrations = await prisma.registration.findMany(queryOptions);
    res.json(registrations); // Retourner tous les modules, y compris ceux sans sessions
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des modules' });
  }
}
