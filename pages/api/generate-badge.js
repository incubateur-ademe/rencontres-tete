import { PDFDocument, rgb } from 'pdf-lib';

export default async (req, res) => {
  if (req.method === 'POST') {
    // Extrait les données envoyées au serveur
    const { nom, prenom, date, region, nomModule, tarif } = req.body;

    // Crée un nouveau document PDF
    const pdfDoc = await PDFDocument.create();

    // Ajoute une page de la taille d'une demi A4 (en points; A4 = 595 x 842)
    const page = pdfDoc.addPage([595, 421]);

    // Définit une couleur de texte
    const color = rgb(0, 0, 0);

    // Ajoute du texte au PDF
    page.drawText(`Rencontre : ${nomModule}\n\nNom : ${nom}\nPrénom : ${prenom}\nDate de la rencontre : ${date}\nLieu de l'événement : ${region}\nTarif : ${tarif}`, {
      x: 50,
      y: 375,
      size: 11,
      color,
    });

    // Convertit le document PDF en Uint8Array
    const pdfBytes = await pdfDoc.save();

    // Envoie le PDF généré comme réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
