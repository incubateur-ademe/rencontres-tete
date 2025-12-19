import nodemailer from 'nodemailer';
import { createMailOptions } from '../../utils/emailUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  console.log('🚀 Test BCC endpoint called');

  try {
    const { email = 'antony@innov-events.fr', withBcc = true } = req.body;

    console.log('📧 Testing BCC to:', email, 'withBcc:', withBcc);

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

    const baseMailOptions = {
      from: '"Test BCC" <contact@territoiresentransitions.fr>',
      to: email,
      subject: "Test BCC - " + (withBcc ? "AVEC BCC" : "SANS BCC"),
      text: `Test d'envoi ${withBcc ? 'AVEC' : 'SANS'} BCC vers klingerantony@gmail.com`,
      html: `<h1>Test BCC</h1><p>Test d'envoi <strong>${withBcc ? 'AVEC' : 'SANS'}</strong> BCC vers klingerantony@gmail.com</p>`
    };

    console.log('🔄 Creating mail options with BCC:', withBcc);
    const finalMailOptions = createMailOptions(baseMailOptions, withBcc);
    console.log('📧 Final options - BCC:', finalMailOptions.bcc);

    const info = await transporter.sendMail(finalMailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: `Email envoyé ${withBcc ? 'AVEC' : 'SANS'} BCC !`,
      messageId: info.messageId,
      to: email,
      bcc: finalMailOptions.bcc,
      bccWorking: withBcc ? !!finalMailOptions.bcc : !finalMailOptions.bcc
    });

  } catch (error) {
    console.error("❌ BCC test error:", error);
    
    res.status(500).json({ 
      success: false,
      error: error.message,
      code: error.code
    });
  }
}