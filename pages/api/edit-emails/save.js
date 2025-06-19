import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { filename, content } = req.body

  if (!filename || !filename.endsWith('.hbs')) {
    return res.status(400).json({ error: 'Nom de fichier invalide' })
  }

  const filePath = path.join(process.cwd(), 'views/emails', filename)

  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur sauvegarde' })
  }
}
