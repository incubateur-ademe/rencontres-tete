import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const avis = await prisma.avis.findMany({ orderBy: { id: 'asc' } })
    res.status(200).json(avis)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
