import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId, sessionId, specialAccount } = req.query;

    if(specialAccount){
      try {
        const satisfactionAfter = await prisma.accountSatisfactionAfter.findFirst({
          where: {
            accountId: parseInt(userId),
            sessionId: parseInt(sessionId),
          },
        });
        if (satisfactionAfter) {
          res.status(200).json({ hasResponded: true });
        } else {
          res.status(200).json({ hasResponded: false });
        }
      } catch (error) {
        console.error('Error checking satisfactionAfter:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification de la satisfactionAfter.' });
      }
    } else {
      try {
        const satisfactionAfter = await prisma.satisfactionAfter.findFirst({
          where: {
            userId: parseInt(userId),
            sessionId: parseInt(sessionId),
          },
        });
        if (satisfactionAfter) {
          res.status(200).json({ hasResponded: true });
        } else {
          res.status(200).json({ hasResponded: false });
        }
      } catch (error) {
        console.error('Error checking satisfactionAfter:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification de la satisfactionAfter.' });
      }
    }

  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
