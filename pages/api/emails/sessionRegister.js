const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // ATTENTION: Ne pas utiliser en production pour des raisons de sécurité
});

export default async function handler(req, res) {

  const { prenom, email, nomRencontre, dateRencontre, lieuRencontre, nbJours, mail_referent, firstDayStartTime } = req.body

  // Configuration de Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Remplacez par l'adresse de votre serveur SMTP
    port: 587, // Port SMTP standard, ajustez selon vos besoins
    secure: false, // Mettez à true pour le port 465, ou false pour les autres ports
    auth: {
      user: 'contact@territoiresentransitions.fr', // Remplacez par votre nom d'utilisateur SMTP
      pass: process.env.BREVO_KEY
    },
    tls: {rejectUnauthorized: false}
  });


  // Configuration de nodemailer-express-handlebars
  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.resolve('./views/emails'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views/emails'),
    extName: '.hbs',
  }));

  // Données pour le template
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
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json(error)
      // return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ status: 'sended' })
  });

}