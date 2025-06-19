import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const dir = path.join(process.cwd(), 'views/emails')

  const emailTemplates = [
    { filename: 'newaccount.hbs', subject: 'Bienvenue sur la plateforme' },
    { filename: 'newaccountdr.hbs', subject: 'Création de compte - animateur/DR' },
    { filename: 'newpassword.hbs', subject: 'Réinitialisation de votre mot de passe' },
    { filename: 'session_after_day.hbs', subject: 'Merci pour votre participation' },
    { filename: 'session_register.hbs', subject: 'Confirmation d’inscription à une session' },
    { filename: 'session_relance_days.hbs', subject: 'Relance - Session dans quelques jours' },
    { filename: 'session_relance_weeks.hbs', subject: 'Relance - Session dans quelques semaines' },
    { filename: 'welcome.hbs', subject: 'Bienvenue à votre première connexion' },
  ]  

  try {
    res.status(200).json(emailTemplates)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lecture des fichiers' })
  }
}
