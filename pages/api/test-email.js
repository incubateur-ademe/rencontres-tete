import { createMailOptions } from './emails/../../../utils/emailUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  console.log('🚀 Test endpoint called');

  try {
    const { testBcc = false } = req.body;

    console.log('🔧 Test parameters:', { testBcc });

    // Tester directement la fonction createMailOptions
    const baseMailOptions = {
      from: '"ADEME" <contact@territoiresentransitions.fr>',
      to: 'antony@innov-events.fr',
      subject: "Test BCC",
      template: 'session_relance_days',
      context: {
        prenom: 'Test',
        siteUrl: 'http://localhost:3000',
      }
    };

    console.log('📧 Testing createMailOptions with testBcc:', testBcc);
    const finalMailOptions = createMailOptions(baseMailOptions, testBcc);
    
    console.log('✅ Final mail options:', {
      to: finalMailOptions.to,
      bcc: finalMailOptions.bcc,
      hasBcc: !!finalMailOptions.bcc
    });

    res.status(200).json({ 
      message: "BCC test completed",
      testBcc: testBcc,
      originalTo: baseMailOptions.to,
      finalTo: finalMailOptions.to,
      finalBcc: finalMailOptions.bcc,
      bccWorking: testBcc ? !!finalMailOptions.bcc : !finalMailOptions.bcc
    });

  } catch (error) {
    console.error("❌ Test email error:", error);
    res.status(500).json({ error: `Test failed: ${error.message}` });
  }
}