/**
 * Utilitaires pour la gestion des emails
 */

export const BREVO_SMTP_USER = 'contact@territoiresentransitions.fr';
export const EMAIL_FROM = '"Rencontres ADEME" <notifications@territoiresentransitions.fr>';
export const EMAIL_REPLY_TO = 'Rencontres ADEME <rencontres.ademe@i-care-consult.com>';

const BCC_EMAIL = 'lucille.bouleau@i-care-consult.com';

/**
 * Ajoute la BCC si c'est le premier email d'une boucle
 * @param {Object} mailOptions - Options du mail nodemailer
 * @param {boolean} isFirstEmailInLoop - Indique si c'est le premier email d'une boucle
 * @returns {Object} - Options du mail avec BCC si nécessaire
 */
export function addBccIfFirstEmail(mailOptions, isFirstEmailInLoop = false) {
  if (isFirstEmailInLoop) {
    return {
      ...mailOptions,
      bcc: BCC_EMAIL
    };
  }
  return mailOptions;
}

/**
 * Créer les options de mail avec BCC conditionnelle
 * @param {Object} baseOptions - Options de base du mail
 * @param {boolean} isFirstEmailInLoop - Indique si c'est le premier email d'une boucle
 * @returns {Object} - Options du mail finales
 */
export function createMailOptions(baseOptions, isFirstEmailInLoop = false) {
  return addBccIfFirstEmail(baseOptions, isFirstEmailInLoop);
}