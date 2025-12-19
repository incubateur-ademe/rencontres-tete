import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  console.log('🚀 Test simple email called');

  try {
    const { email = 'antony@innov-events.fr' } = req.body;

    console.log('📧 Testing email to:', email);
    console.log('🔑 BREVO_KEY exists:', !!process.env.BREVO_KEY);
    console.log('🔑 BREVO_KEY starts with:', process.env.BREVO_KEY?.substring(0, 10) + '...');

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

    console.log('📮 Attempting to send email...');

    const mailOptions = {
      from: '"Test ADEME" <contact@territoiresentransitions.fr>',
      to: email,
      subject: "Test Email Simple",
      text: "Ceci est un test simple pour vérifier que l'envoi d'email fonctionne.",
      html: "<h1>Test Email</h1><p>Ceci est un test simple pour vérifier que l'envoi d'email fonctionne.</p>"
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: "Email envoyé avec succès !",
      messageId: info.messageId,
      to: email
    });

  } catch (error) {
    console.error("❌ Email error:", error.message);
    console.error("❌ Full error:", error);
    
    res.status(500).json({ 
      success: false,
      error: error.message,
      code: error.code,
      details: "Vérifiez votre clé Brevo et votre quota"
    });
  }
}