import prisma from '@/prisma'

export default async function handle(req, res) {
  const { id } = req.query;

  let queryOptions = {
    include: {
      session: {
        include: {
            module: true
        }
      },
    },
  };

  if (id) {
    queryOptions.where = {
      id: parseInt(id),
    };
  }

  const registration = await prisma.registration.findMany(queryOptions);

  res.json(registration);
}
