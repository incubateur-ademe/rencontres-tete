import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { createMailOptions } from '../../../utils/emailUtils.js';

export default async function handler(req, res) {
  const { prenom, email, isFirstEmailInLoop } = req.body;

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

  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.resolve('./views/emails'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views/emails'),
    extName: '.hbs',
  }));

  const baseMailOptions = {
    from: '"ADEME" <contact@territoiresentransitions.fr>',
    to: email,
    subject: "Vous avez participé à une Rencontre Territoire Engagé il y a quelques mois ... Quel impact sur votre métier ?",
    template: 'questionnaire_impact',
    context: {
      prenom: prenom,
      siteUrl: process.env.WEBSITE_URL,
    }
  };

  const mailOptions = createMailOptions(baseMailOptions, isFirstEmailInLoop);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json(error);
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ status: 'sended' });
  });
}
