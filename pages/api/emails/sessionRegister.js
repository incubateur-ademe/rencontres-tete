import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export default async function handler(req, res) {
  // Extraction des données du corps de la requête
  const { prenom, email, nomRencontre, dateRencontre, lieuRencontre, nbJours, mail_referent, firstDayStartTime } = req.body;

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

    // Utilisation de Handlebars pour les templates d'e-mails
    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./views/emails'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views/emails'),
      extName: '.hbs',
    }));

    // Options de l'e-mail
    const mailOptions = {
      from: '"ADEME" <contact@territoiresentransitions.fr>',
      to: email,
      subject: "Inscription à une Rencontre Territoire Engagé Transition Ecologique",
      template: 'session_register',
      context: {
        prenom: prenom,
        siteUrl: process.env.WEBSITE_URL,
        nomRencontre: nomRencontre,
        lieuRencontre: lieuRencontre,
        nbJours: nbJours,
        dateRencontre: dateRencontre,
        mail_referent: mail_referent,
        firstDayStartTime: firstDayStartTime
      }
    };

    // Envoi de l'e-mail
    const info = await transporter.sendMail(mailOptions);

    // Si l'envoi est réussi, réponse avec un statut 200
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ status: 'sended', messageId: info.messageId });

  } catch (error) {
    // Gestion des erreurs et réponse avec un statut 500
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail', details: error });
  }
}
