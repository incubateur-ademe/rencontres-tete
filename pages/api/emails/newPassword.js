const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');


export default async function handler(req, res) {

  const { email, password } = req.body

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'contact@territoiresentransitions.fr',
      pass: process.env.BREVO_KEY
    },
    tls: {rejectUnauthorized: false}
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

  const mailOptions = {
    from: '"ADEME" <contact@territoiresentransitions.fr>',
    to: email,
    subject: "Votre nouveau mot de passe !",
    template: 'newpassword',
    context: {
        password: password,
        siteUrl: process.env.WEBSITE_URL,
    }
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json(error)
      // return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ status: 'sended' })
  });

}