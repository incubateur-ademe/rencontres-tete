import prisma from '@/prisma'

export default async function handle(req, res) {
    const { mail } = req.query;
  
    let queryOptions = {
      where: {},
    };
  
    if (mail) {
      queryOptions.where.mail = mail;
    }
  
    try {
      const userExist = await prisma.user.findMany(queryOptions);
      if(userExist.length > 0){
        res.json({ exist: true });
      }
      else{
        res.json({ exist: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Une erreur est survenue lors de la requête." });
    }
  }
  
