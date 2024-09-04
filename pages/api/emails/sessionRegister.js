import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Étape 1: Vérifier si la requête contient le body attendu
    const { prenom, email, nomRencontre, dateRencontre, lieuRencontre, nbJours, mail_referent, firstDayStartTime } = req.body;

    if (!prenom || !email || !nomRencontre || !dateRencontre) {
      return res.status(400).json({ error: "Données manquantes dans la requête", body: req.body });
    }

    // Étape 2: Configurer le transporteur Nodemailer
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

    // Étape 3: Configurer Handlebars pour les templates
    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./views/emails'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views/emails'),
      extName: '.hbs',
    }));

    // Étape 4: Préparer les options d'email
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

    // Étape 5: Essayer d'envoyer l'email
    try {
      const info = await transporter.sendMail(mailOptions);
      return res.status(200).json({ status: 'sended', messageId: info.messageId });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail', details: error.message });
    }

  } catch (error) {
    // Gestion générale des erreurs
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
