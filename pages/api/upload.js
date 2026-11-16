import { IncomingForm } from 'formidable';
import { randomUUID } from 'crypto';
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

  const files = Object.values(data.files).flat();
  const urlsPDF = [];

  try {
    for (const file of files) {
      const nom = file.originalFilename || 'fichier';
      const safeFilename = nom.normalize('NFC').replace(/[^a-zA-Z0-9_.-]/g, '_');
      // UUID : pas de collision, donc pas d'écrasement (PutObject remplace sans prévenir).
      const key = `uploads/${randomUUID()}_${safeFilename}`;
      // ponytail: fichier lu en mémoire, passer à un stream si les PDF deviennent lourds.
      const url = await uploadPublic(key, await fs.promises.readFile(file.filepath), file.mimetype);
      urlsPDF.push({ nom, url });
    }
    res.status(200).json({ urlsPDF });
  } catch (error) {
    // Un seul échec fait échouer la requête : sinon la session est enregistrée sans ses fichiers.
    console.error("Erreur lors de l'envoi du fichier vers le stockage :", error);
    res.status(502).json({ error: "Erreur lors de l'envoi du fichier vers le stockage" });
  } finally {
    await Promise.all(files.map(file => fs.promises.unlink(file.filepath).catch(() => {})));
  }
}
