/**
 * Utilitaires pour la gestion des emails
 */

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