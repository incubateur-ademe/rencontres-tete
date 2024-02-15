import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Assurez-vous que le dossier d'upload existe
  const uploadDir = path.resolve('./public/uploads');
  if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true, // Support pour plusieurs fichiers
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

  // Vérifiez si la promesse a été rejetée et a retourné
  if (!data) return;

  // Traitement des fichiers uploadés pour renvoyer les URLs
  const urlsPDF = Object.values(data.files).flatMap(fileArray => {
    // Gérer les cas où plusieurs fichiers sont uploadés sous le même nom
    const files = Array.isArray(fileArray) ? fileArray : [fileArray];
    return files.map(file => {
      const filePath = path.relative('./public', file.filepath);
      // Utiliser une URL relative ou ajuster selon votre logique de serveur
      return `/uploads/${path.basename(filePath)}`;
    });
  });

  res.status(200).json({ urlsPDF });
}
