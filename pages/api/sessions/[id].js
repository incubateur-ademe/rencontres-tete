import prisma from '@/prisma'

export default async function handle(req, res) {
  const { id } = req.query;

  let queryOptions = {
    include: {
      metasSession: true,
    },
  };

  if (id) {
    queryOptions.where = {
      id: parseInt(id),
    };
  }

  const sessions = await prisma.session.findMany(queryOptions);

  res.json(sessions);
}
