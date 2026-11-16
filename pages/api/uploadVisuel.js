import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { uploadPublic } from '@/lib/storage';
import { requireAdmin } from '@/utils/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
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
      const safeFilename = file.originalFilename
        .normalize('NFC')
        .replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
      // Préfixe horodaté : jamais de collision ni d'écrasement.
      const key = `uploads/${Date.now()}_${safeFilename}`;

      try {
        const url = await uploadPublic(key, fs.readFileSync(file.filepath), file.mimetype);
        urlsPDF.push({ nom: file.originalFilename, url });
      } catch (error) {
        console.error("Erreur lors de l'envoi du fichier vers le stockage :", error);
      }
    }
  }

  res.status(200).json({ urlsPDF });
}
