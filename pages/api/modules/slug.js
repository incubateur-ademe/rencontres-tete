import prisma from '@/prisma'

export default async function handle(req, res) {
  const { slug } = req.query;

  let queryOptions = {
    include: {
      metasModule: true,
    },
  };

  if (slug) {

    queryOptions.where = {
      slug: slug
    };

    const data = await prisma.module.findMany(queryOptions);

    if(data.length > 0){
      res.json({
        page: true,
        data: data
      });
    }
    else{
      res.json({
        page: false
      });      
    }

  }


}
