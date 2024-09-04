import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: 'contact@territoiresentransitions.fr',
        pass: process.env.BREVO_KEY
      },
      tls: { rejectUnauthorized: false }
    });

    // Test de la connexion SMTP
    transporter.verify(function(error, success) {
      if (error) {
        console.log('Erreur de connexion SMTP:', error);
        return res.status(500).json({ status: 'error', message: 'Connexion au serveur SMTP échouée', details: error.message });
      } else {
        console.log('Connexion au serveur SMTP réussie');
        return res.status(200).json({ status: 'success', message: 'Connexion au serveur SMTP réussie' });
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors de la tentative de connexion', details: error.message });
  }
}
