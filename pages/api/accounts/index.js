import prisma from '@/prisma'

export default async function handle(req, res) {

  let queryOptions = {}

  const accounts = await prisma.account.findMany(queryOptions) || [];

  res.json(accounts);
}
