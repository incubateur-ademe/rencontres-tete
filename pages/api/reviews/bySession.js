import prisma from '@/prisma';

export default async function handle(req, res) {
  const { sessionId } = req.query;

  const parsedSessionId = parseInt(sessionId);

  try {
    const reviews = await prisma.review.findMany({
      where: {
        sessionId: parsedSessionId,
      },
      include: {
        user: true
      }
    });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des inscriptions' });
  }
}
