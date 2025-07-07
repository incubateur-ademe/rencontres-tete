// pages/politique-donnees-personnelles.js
import Head from 'next/head'
import styles from '@/styles/Page.module.css'

export default function PolitiqueDonneesPersonnelles() {
  return (
    <>
      <Head>
        <title>Politique de protection des données personnelles</title>
      </Head>
      <div className={styles.Page}>
        <div className="section blued">
          <div className="boxed">
            <h1>Politique de protection des données personnelles</h1>
          </div>
        </div>

        <div className="section">
          <div className="boxed">
            <p><em>Mis à jour le 01/09/2024</em></p>

            <section>
              <h2>Introduction</h2>
              <p>
                L’Agence de l’Environnement et de la Maîtrise de l’Énergie (« ADEME »), établissement public à caractère industriel et commercial dont le siège est situé 20, avenue du Grésillé 49000 Angers, attache une grande importance à la protection des Données à caractère personnel qu’elle collectionne et traite dans le cadre de ses activités (sites Internet, applications, services, etc.).
              </p>
              <p>
                Cette Politique décrit :
              </p>
              <ul>
                <li>Les traitements de données opérés par l’ADEME et leurs bases légales ;</li>
                <li>Les droits des personnes concernées ;</li>
                <li>Les éventuels transferts hors de l’Union européenne.</li>
              </ul>
            </section>

            <section>
              <h2>Définitions</h2>
              <p>Dans cette Politique :</p>
              <ul>
                <li><strong>Données à caractère personnel</strong> : toute information se rapportant à une personne physique identifiée ou identifiable.</li>
                <li><strong>Personne concernée</strong> : personne physique identifiée ou identifiable.</li>
                <li><strong>Responsable du traitement</strong> : ADEME.</li>
                <li><strong>Traitement</strong> : toute opération ou ensemble d’opérations sur des données personnelles.</li>
                <li><strong>Sites, Produits, Services</strong> : pages web, applications, bases de données, etc., exploités par l’ADEME.</li>
              </ul>
            </section>

            <section>
              <h2>Engagements de l’ADEME</h2>
              <p>
                L’ADEME garantit un niveau de protection élevé et respecte les principes de licéité, loyauté, transparence, minimisation, exactitude et sécurité des données conformément au RGPD.
              </p>
              <p>
                Elle impose le même niveau de protection à ses sous-traitants et forme son personnel aux bonnes pratiques.
              </p>
            </section>

            <section>
              <h2>Catégories de données collectées</h2>
              <ul>
                <li><strong>Données d’identification</strong> : nom, prénom, pseudonyme, date de naissance.</li>
                <li><strong>Données de contact</strong> : téléphone, adresse postale, email.</li>
              </ul>
              <p>Collectées via formulaires, newsletters, création de compte, candidatures, etc.</p>
            </section>

            <section>
              <h2>Finalités et bases légales</h2>
              <ul>
                <li><strong>Exécution contractuelle</strong> : gestion de compte, communications, accès aux services.</li>
                <li><strong>Consentement</strong> : newsletters, services personnalisés, jeux-concours, gestion des cookies.</li>
                <li><strong>Obligations légales</strong> : réponses aux autorités, respect de la réglementation.</li>
                <li><strong>Intérêt légitime</strong> : amélioration des services, lutte contre la fraude, prospection commerciale.</li>
                <li><strong>Mission d’intérêt public</strong> : aides, formalités administratives.</li>
              </ul>
            </section>

            <section>
              <h2>Durées de conservation</h2>
              <ul>
                <li><strong>Relation utilisateur</strong> : durée de vie du compte ou dernier contact + délai de prescription (5 ans).</li>
                <li><strong>Services personnalisés et facultatifs</strong> : 3 ans après le dernier contact.</li>
                <li><strong>Jeux-concours</strong> : 3 ans après le dernier contact.</li>
                <li><strong>Formalités administratives</strong> : durée de l’instruction + 5 ans.</li>
                <li><strong>Réponses aux autorités</strong> : durée de l’instruction.</li>
                <li><strong>Droits d’exercice</strong> : 1 à 6 ans selon le droit concerné.</li>
                <li><strong>Fraude et abus</strong> : alertes non pertinentes supprimées au bout de 12 mois, alertes qualifiées conservées 5 ans.</li>
                <li><strong>Sécurité</strong> : traces informatiques conservées 13 mois.</li>
                <li><strong>Prospection, gestion interne</strong> : 3 ans ou durée de la relation + 5 ans.</li>
                <li><strong>Cookies</strong> : consentement conservé 6 mois, données statistiques 25 mois.</li>
              </ul>
            </section>

            <section>
              <h2>Destinataires et transferts</h2>
              <p>
                Les données sont communiquées au personnel habilité, aux partenaires et prestataires sous contrat de confidentialité.
              </p>
              <p>
                En cas de transfert hors UE, l’ADEME met en place des garanties (clauses contractuelles types, etc.) et informe préalablement les personnes concernées.
              </p>
            </section>

            <section>
              <h2>Exercice des droits</h2>
              <p>
                Conformément au RGPD, vous pouvez exercer vos droits d’accès, rectification, suppression, limitation, opposition, portabilité et retrait de consentement à tout moment.
              </p>
              <p>
                Ces demandes sont à adresser au Délégué à la Protection des Données :  
                <br />ADEME – DPO, 20 avenue du Grésillé – BP 90406 – 49004 Angers Cedex 01  
                <br /><a href="mailto:rgpd@ademe.fr">rgpd@ademe.fr</a>
              </p>
            </section>

            <section>
              <h2>Sécurité informatique</h2>
              <p>
                L’ADEME met en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données (confidentialité, intégrité, disponibilité).
              </p>
              <p>
                Veillez à ne pas partager vos mots de passe, à vous déconnecter et à fermer votre navigateur sur postes partagés.
              </p>
            </section>

            <section>
              <h2>Données concernant les mineurs</h2>
              <p>
                L’ADEME ne collecte pas de données d’enfants de moins de 16 ans sans accord parental. En cas de collecte, les parents peuvent demander l’effacement des données à tout moment.
              </p>
            </section>

            <section>
              <h2>Liens vers d’autres sites</h2>
              <p>
                Les sites de l’ADEME peuvent contenir des liens externes. L’ADEME n’est pas responsable des politiques de protection des données de ces tiers.
              </p>
            </section>

            <section>
              <h2>Modifications de la Politique</h2>
              <p>
                L’ADEME se réserve le droit de faire évoluer cette Politique. Toute mise à jour sera publiée avec une nouvelle date de « dernière mise à jour » en haut de page.
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
