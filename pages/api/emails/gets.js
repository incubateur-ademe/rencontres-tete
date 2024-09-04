const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

export default async function handler(req, res) {
  try {
    // Extraction des données du corps de la requête
    const { prenom, email } = req.body;

    if (!prenom || !email) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Configuration du transporteur Nodemailer
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

    // Configuration de Handlebars pour les templates
    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./views/emails'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views/emails'),
      extName: '.hbs',
    }));

    // Options d'e-mail
    const mailOptions = {
      from: '"ADEME" <contact@territoiresentransitions.fr>',
      to: email,
      subject: "Bienvenue sur la plateforme des Rencontres Territoire Engagé Transition Ecologique !",
      template: 'welcome',
      context: {
        prenom: prenom,
        siteUrl: process.env.WEBSITE_URL,
      }
    };

    // Tentative d'envoi de l'e-mail
    try {
      const info = await transporter.sendMail(mailOptions); // Utilisation d'await
      console.log('Message sent: %s', info.messageId);
      return res.status(200).json({ status: 'sended', messageId: info.messageId });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail', details: error.message });
    }

  } catch (error) {
    console.error('Erreur générale:', error);
    return res.status(500).json({ error: 'Erreur générale', details: error.message });
  }
}
