import prisma from '@/lib/prisma';

// Helper function to serialize BigInts in an object
// This function recursively walks through an object and converts
// any BigInt values it finds into strings.
function serializeBigInts(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    })
  );
}

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
        // Even 'existing' might have a BigInt, so it's good practice to serialize if returning it.
        // However, in this specific case, we're just returning an error message.
        return res.status(409).json({ error: 'Vous êtes déjà inscrit(e) pour cette région.' });
      }
  
      const alerte = await prisma.alerte.create({
        data: {
          email,
          region,
        },
      });
  
      // Before sending the response, serialize the 'alerte' object
      // to handle the BigInt 'id' field.
      const serializedAlerte = serializeBigInts(alerte);
  
      return res.status(200).json({ 
        message: '✅ Alerte enregistrée avec succès.', 
        alerte: serializedAlerte // Send the serialized version
      });

    } catch (error) {
      console.error('Erreur lors de la création de l’alerte :', error);
      // For generic server errors, you might not need to serialize anything,
      // but if the 'error' object itself contains BigInts from Prisma,
      // you might run into issues here too. For now, we assume the error
      // object itself won't directly contain BigInts from Prisma results.
      return res.status(500).json({ error: 'Erreur serveur lors de l’enregistrement' });
    }
}