import prisma from '@/prisma';

export default async function handle(req, res) {
  const { search } = req.query;

  if (!search || search.trim() === '') {
    return res.status(400).json({ error: 'Le paramètre de recherche est requis' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            nom: {
              contains: search, // Recherche partielle sur le nom
              mode: 'insensitive', // Recherche insensible à la casse
            },
          },
          {
            mail: {
              contains: search, // Recherche partielle sur l'email
              mode: 'insensitive', // Recherche insensible à la casse
            },
          },
        ],
      },
    });

    const usersAdmins = await prisma.account.findMany({
      where: {
        email: {
          contains: search, // Recherche partielle sur l'email
          mode: 'insensitive', // Recherche insensible à la casse
        },
      },
    });

    if (users.length === 0 && usersAdmins.length === 0) {
      return res.json([]);
    }

    res.json([...users, ...usersAdmins]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
}