import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export default async function handler(req, res) {
  
    res.status(200).json({ a: process.env.WEBSITE_URL, b: process.env.BREVO_KEY });

}
