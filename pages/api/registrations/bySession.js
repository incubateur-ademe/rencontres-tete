import prisma from '@/prisma';

export default async function handle(req, res) {
  const { sessionId } = req.query;

  const parsedSessionId = parseInt(sessionId);

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        sessionId: parsedSessionId,
      },
      include: {
        session: {
          include: {
            reviews: true,
            metasSession: true
          }
        },
        user: true
      },
    });

    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des inscriptions' });
  }
}
