import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // ATTENTION: Ne pas utiliser en production pour des raisons de sécurité
});

export default async function handler(req, res) {
  const { prenom, email, nomRencontre, dateRencontre, lieuRencontre, nbJours, mail_referent, firstDayStartTime } = req.body;

  // Configuration de Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Remplacez par l'adresse de votre serveur SMTP
    port: 587, // Port SMTP standard, ajustez selon vos besoins
    secure: false, // Mettez à true pour le port 465, ou false pour les autres ports
    auth: {
      user: 'contact@territoiresentransitions.fr', // Remplacez par votre nom d'utilisateur SMTP
      pass: process.env.BREVO_KEY
    },
    tls: { rejectUnauthorized: false }
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

  // Format de la date pour l'ICS (ex: 20240517T080000Z)
  const icsDateStart = `${dateRencontre.replace(/-/g, '')}T${firstDayStartTime.replace(/:/g, '')}00Z`;
  const icsDateEnd = `${dateRencontre.replace(/-/g, '')}T${(parseInt(firstDayStartTime.split(':')[0]) + 2).toString().padStart(2, '0')}${firstDayStartTime.split(':')[1]}00Z`;

  // Contenu de l'ICS
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${nomRencontre}
DTSTART:${icsDateStart}
DTEND:${icsDateEnd}
DESCRIPTION:Rencontre Territoire Engagé Transition Ecologique
LOCATION:${lieuRencontre}
END:VEVENT
END:VCALENDAR`;

  // Encodage du contenu ICS pour utilisation dans une URL
  const encodedIcsContent = encodeURIComponent(icsContent).replace(/%20/g, ' ');

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
      firstDayStartTime: firstDayStartTime,
      icsLink: `data:text/calendar;charset=utf8,${encodedIcsContent}`
    }
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json(error);
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ status: 'sended' });
  });
}
