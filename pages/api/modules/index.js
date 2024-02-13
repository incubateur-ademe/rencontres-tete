import prisma from '@/prisma'

export default async function handle(req, res) {

  const { pilier, tri } = req.query;

  let queryOptions = {};

  if (pilier) {
    queryOptions.where = {
      pilier: pilier,
    };
  }

  if (tri) {
    queryOptions.orderBy = {
      id: tri,
    };
  }

  const modules = await prisma.module.findMany(queryOptions);
  res.json(modules);
}
