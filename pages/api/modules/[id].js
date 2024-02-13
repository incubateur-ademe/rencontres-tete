import prisma from '@/prisma'

export default async function handle(req, res) {
  const { id } = req.query;

  let queryOptions = {
    include: {
      metasModule: true,
    },
  };

  if (id) {
    queryOptions.where = {
      id: parseInt(id),
    };
  }

  const modules = await prisma.module.findMany(queryOptions);

  res.json(modules);
}
