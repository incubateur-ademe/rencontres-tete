import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { filename } = req.query
  const filePath = path.join(process.cwd(), 'views/emails', filename)

  if (!filename || !filename.endsWith('.hbs')) {
    return res.status(400).json({ error: 'Fichier invalide' })
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    res.status(200).json({ content })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lecture du fichier' })
  }
}
