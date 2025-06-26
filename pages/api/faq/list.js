import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const faqs = await prisma.faq.findMany({
        where: {
          question: {
            not: "",
          },
          reponse: {
            not: "",
          },
        },
        select: {
          id: true,
          question: true,
          reponse: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      res.status(200).json({ faqs });
    } catch (error) {
      console.error('Erreur lors de la récupération des FAQs:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
