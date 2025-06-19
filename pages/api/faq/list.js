import prisma from '@/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { id: 'asc' },
    })

    res.status(200).json(faqs)
  } catch (error) {
    console.error('Erreur FAQ GET:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
