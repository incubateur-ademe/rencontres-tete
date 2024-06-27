// pages/api/registrations/updatePresence.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, sessionId, presence } = req.body;

    try {
      const updatedRegistration = await prisma.registration.updateMany({
        where: {
          userId: userId,
          sessionId: sessionId,
        },
        data: {
          presence: presence,
        },
      });

      if (updatedRegistration.count === 0) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      res.status(200).json(updatedRegistration);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update presence', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
