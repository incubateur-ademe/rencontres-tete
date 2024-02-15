import prisma from '@/prisma'

export default async function handle(req, res) {
  const { userId, sessionId } = req.query;

  let queryOptions = {};

  if (userId && sessionId) {
    queryOptions.where = {
      userId: parseInt(userId),
      sessionId: parseInt(sessionId)
    };
  }

  const review = await prisma.review.findMany(queryOptions);

  res.json(review);
}
