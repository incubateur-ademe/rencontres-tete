import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  
    const { email, region } = req.body;
  
    if (!email || !region) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
  
    try {
      // Vérifie si une alerte existe déjà
      const existing = await prisma.alerte.findFirst({
        where: {
          email,
          region,
        },
      });
  
      if (existing) {
        return res.status(409).json({ error: 'Vous êtes déjà inscrit(e) pour cette région.' });
      }
  
      const alerte = await prisma.alerte.create({
        data: {
          email,
          region,
        },
      });
  
      return res.status(200).json({ message: '✅ Alerte enregistrée avec succès.', alerte });
    } catch (error) {
      console.error('Erreur lors de la création de l’alerte :', error);
      return res.status(500).json({ error: 'Erreur serveur lors de l’enregistrement' });
    }
  }