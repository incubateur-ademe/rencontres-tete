// pages/mentions-legales.js
import Head from 'next/head'
import styles from '@/styles/Page.module.css'

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions légales</title>
      </Head>
      <div className={styles.Page}>
        <div className="section blued">
          <div className="boxed">
            <h1>Mentions légales</h1>
          </div>
        </div>

        <div className="section">
          <div className="boxed">
            <p><em>Mis à jour le 01/09/2024</em></p>

            <section>
              <h2>Présentation du site</h2>
              <p>
                Il est précisé aux utilisateurs des sites <a href="https://ademe.fr">ademe.fr</a> l'identité des différents intervenants
                dans le cadre de sa réalisation et de son suivi :
              </p>

              <h3>Propriétaire et éditeur</h3>
              <p>
                Conformément aux dispositions de l’article 6-I 1° de la loi n°2004-575 du 21 juin 2004 relative à la confiance dans l’économie numérique, 
                l’éditeur des sites ademe.fr est l’Agence de l’Environnement et de la Maîtrise de l’Energie (ADEME), 
                Établissement Public à caractère Industriel et Commercial (EPIC) régi par les articles L.131-3 à L.131-7 et R.131-1 à R.131-26 
                du Code de l’environnement, ayant son siège social au :
              </p>
              <address>
                20, avenue du Grésillé BP 90406<br />
                49004 Angers Cedex 01<br />
                Tél. : 02 41 20 41 20
              </address>
              <p>
                Inscrit au registre du commerce d'Angers sous le n° 385 290 309, représenté par Sylvain Waserman, agissant en qualité de Président du conseil d'administration.
              </p>
              <p>
                Le directeur de la publication est Monsieur Sylvain Waserman, en qualité de représentant légal de l’ADEME.
              </p>
              <p>
                La personne responsable de l'accès aux documents administratifs et des questions relatives à la réutilisation 
                des informations est Monsieur Luc Morinière, Chef du service juridique.
              </p>

              <h3>Hébergeur</h3>
              <p>
                Le prestataire assurant le stockage direct et permanent du site : rencontres.territoiresentransitions.fr est DRI SAS Digital Rural Informatique, 
                9 rue du Petit Châtelier, 44303 Nantes Cedex 3, Tél. : 02 90 92 05 50.
              </p>

              <h3>Utilisateur</h3>
              <p>
                Internaute qui navigue, lit, visionne et utilise le site ademe.fr et ses services.
              </p>
            </section>

            <section>
              <h2>Acceptation des conditions d’utilisation</h2>
              <p>
                L’utilisation des sites ademe.fr implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. 
                Ces conditions peuvent être modifiées à tout moment ; les utilisateurs sont invités à les consulter régulièrement.
              </p>
              <p>
                L’utilisateur reconnaît avoir pris connaissance de ces conditions lors de sa connexion et les accepter sans réserve.
              </p>
            </section>

            <section>
              <h2>Description des services fournis</h2>
              <p>
                Les sites ademe.fr ont pour objet de fournir des informations concernant la transition écologique, l’expertise de l’ADEME, 
                les actions territoriales, l’action internationale et les programmes de recherche et d’innovation.
              </p>
              <p>
                L’ADEME s’efforce de fournir des informations aussi précises que possible. Toutefois, elle ne pourra être tenue responsable 
                des omissions, inexactitudes, retards de mise à jour ou de tout autre manquement, qu’ils soient de son fait ou du fait 
                de ses partenaires.
              </p>
              <p>
                Les informations sont données à titre indicatif et peuvent évoluer après leur mise en ligne.
              </p>
            </section>

            <section>
              <h2>Disponibilité du site</h2>
              <p>
                L’ADEME s’efforce d’assurer un accès 24 h/24, 7 j/7, sauf force majeure ou maintenance. Elle ne garantit ni la disponibilité, 
                ni les performances du site.
              </p>
              <p>
                Aucun support technique n’est prévu. La responsabilité de l’ADEME ne peut être engagée en cas d’interruption du service.
              </p>
            </section>

            <section>
              <h2>Liens hypertextes</h2>
              <p>L’ADEME décline toute responsabilité sur le contenu des sites liés.</p>
              <p>
                Tout site est autorisé à établir un lien vers ademe.fr sans autorisation préalable, sauf pour les sites diffusant des contenus 
                polémiques, pornographiques, xénophobes ou portant atteinte à la sensibilité du public.
              </p>
            </section>

            <section>
              <h2>Cookies de navigation</h2>
              <p>
                Des cookies sont utilisés pour faciliter la navigation, proposer des contenus personnalisés et réaliser des statistiques.
              </p>
              <p>
                Pour en savoir plus, consultez notre <a href="/politique-des-cookies">Politique des cookies</a> via le lien « Gestion des cookies » 
                (ancre `#tarteaucitron`) en pied de page.
              </p>
            </section>

            <section>
              <h2>Propriété intellectuelle</h2>
              <p>
                L’ADEME est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments 
                du site (textes, images, logos, etc.).
              </p>
              <p>
                Toute reproduction ou exploitation non autorisée est interdite et constitue une contrefaçon (articles L.335-2 et suivants 
                du Code de la propriété intellectuelle).
              </p>
              <p>
                La réutilisation non commerciale et pédagogique est autorisée sous réserve de mentionner l’origine et la date de publication.
              </p>
              <p>
                Pour une réutilisation commerciale, une licence doit être demandée à l’ADEME.
              </p>
            </section>

            <section>
              <h2>Gestion des données personnelles</h2>
              <p>
                Conformément au RGPD, l’ADEME, en tant que responsable de traitement, collecte et traite des données à caractère personnel.
              </p>
              <p>
                Pour consulter la Politique de protection des données personnelles et exercer vos droits, rendez-vous dans le pied de page.
              </p>
            </section>

            <section>
              <h2>Votre attention</h2>
              <p>
                Nous ne garantissons pas la confidentialité des échanges sur Internet. Pour plus de sécurité, utilisez la voie postale.
              </p>
              <p>
                L’ADEME décline toute responsabilité quant aux difficultés techniques rencontrées sur le site.
              </p>
            </section>

            <section>
              <h2>Droit applicable</h2>
              <p>
                Le droit applicable est le droit français. En cas de litige, la juridiction compétente sera déterminée selon le droit commun.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
