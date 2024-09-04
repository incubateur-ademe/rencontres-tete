const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    try {
      // Retourner des informations dans la réponse pour les consulter
      const logs = [];
  
      // Ajouter des logs pour inspecter la requête
      logs.push({ message: 'Requête reçue', body: req.body });
  
      // Vérification de la clé BREVO_KEY
      logs.push({ message: 'Clé BREVO_KEY', value: process.env.BREVO_KEY });
  
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
          logs.push({ message: 'Erreur de connexion SMTP', error: error.message });
          return res.status(500).json({ status: 'error', logs: logs, message: 'Connexion au serveur SMTP échouée', details: error.message });
        } else {
          logs.push({ message: 'Connexion au serveur SMTP réussie' });
          return res.status(200).json({ status: 'success', logs: logs, message: 'Connexion au serveur SMTP réussie' });
        }
      });
    } catch (error) {
      // Capturer et retourner l'erreur
      res.status(500).json({ status: 'error', message: 'Erreur lors de la tentative de connexion', details: error.message });
    }
  }
  