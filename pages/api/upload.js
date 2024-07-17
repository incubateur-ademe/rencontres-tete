import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const uploadDir = path.resolve('/tmp/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: `Erreur lors de l'analyse du formulaire: ${err.message}` });
    return;
  });

  if (!data) return;

  const urlsPDF = [];
  
  for (const fileArray of Object.values(data.files)) {
    const files = Array.isArray(fileArray) ? fileArray : [fileArray];
    for (const file of files) {
      const filePath = path.relative('.', file.filepath);
      const fileBuffer = fs.readFileSync(file.filepath);
      const filename = `uploads/${file.originalFilename}`;

      const { data: existingFiles, error: listError } = await supabase
        .storage
        .from('ademe')
        .list('uploads', {
          search: file.originalFilename
        });

      if (listError) {
        console.error('Erreur lors de la vérification de l\'existence du fichier sur Supabase:', listError);
        continue;
      }

      let uploadFilename = filename;
      if (existingFiles && existingFiles.length > 0) {
        const timestamp = Date.now();
        uploadFilename = `uploads/${timestamp}_${file.originalFilename}`;
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ademe')
        .upload(uploadFilename, fileBuffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        console.error('Erreur lors de l\'upload sur Supabase:', uploadError);
        continue;
      }

      const { data: publicURL, error: urlError } = await supabase.storage
        .from('ademe')
        .getPublicUrl(uploadFilename);

      if (urlError) {
        console.error('Erreur lors de la récupération de l\'URL publique sur Supabase:', urlError);
        continue;
      }

      console.log('Public URL:', publicURL);

      urlsPDF.push({
        nom: file.originalFilename,
        url: publicURL.publicUrl
      });
    }
  }

  res.status(200).json({ urlsPDF, env1:supabaseUrl, env2:supabaseKey});
}
