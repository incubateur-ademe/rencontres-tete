import Head from 'next/head'
import Link from 'next/link'
import prisma from '@/prisma'
import { useState, useEffect } from 'react'
import Verbatims from '@/components/Verbatims'
import styles from '@/styles/Page.module.css'

export default function PolitiqueCookies() {
  return (
    <>
      <Head>
        <title>Politique des cookies</title>
      </Head>
      <div className={styles.Page}>
        <div className="section blued">
          <div className="boxed">
            <h1>Politique des cookies</h1>
          </div>
        </div>

        <div className="section">
          <div className="boxed">
            <p><em>Mis à jour le 01/09/2024</em></p>
            <p>
              Rencontres et Territoires en Transitions souhaite vous informer de manière claire et transparente sur l&apos;usage des cookies lorsque vous consultez le site :
            </p>
            <p>
              <a href="https://rencontres.territoiresentransitions.fr">
                https://rencontres.territoiresentransitions.fr
              </a>
            </p>
            <p>
              À tout moment, en cliquant sur le lien <a href="#tarteaucitron">« Gestion des cookies »</a>, vous pouvez modifier vos préférences.
            </p>

            <section>
              <h2>Préambule</h2>
              <p>
                Pour permettre aux internautes de bénéficier des services proposés par le site 
                <a href="https://rencontres.territoiresentransitions.fr/">
                  rencontres.territoiresentransitions.fr
                </a>
                &nbsp;(ci-après le « Site »), tels que sa consultation, l’optimisation de son utilisation ou sa personnalisation en fonction de l’internaute,
                le Site utilise des cookies.
              </p>
              <p>
                Vous pouvez à tout moment désactiver les cookies auxquels vous avez consenti, et ce gratuitement, à partir des possibilités de désactivation
                qui vous sont offertes et rappelées ci-après.
              </p>
            </section>

            <section>
              <h2>Définitions</h2>
              <p>
                Les cookies sont des informations relatives à la navigation de votre terminal (ordinateur, tablette, smartphone, etc.) sur le Site.
                Ils sont utilisés pour envoyer des informations à votre navigateur et permettre à celui-ci de renvoyer des informations au Site
                (par exemple un identifiant de session ou le choix d’une langue).
              </p>
              <p>Seul l’émetteur d’un cookie peut lire ou modifier les informations qui y sont contenues. Il existe différents types de cookies :</p>
              <ul>
                <li>Cookies de session : disparaissent dès que vous quittez le Site.</li>
                <li>Cookies permanents : demeurent sur votre terminal jusqu’à expiration de leur durée de vie ou jusqu’à suppression par l’utilisateur.</li>
              </ul>
              <p>
                Vous êtes informés que, lors de vos visites sur ce Site, des cookies peuvent être installés sur votre équipement terminal.
              </p>
            </section>

            <section>
              <h2>Finalités des cookies utilisés</h2>
              <p>
                Les cookies sont utilisés sur le Site pour différentes finalités : faciliter votre navigation, proposer des contenus personnalisés
                et réaliser des statistiques de visites.
              </p>

              <h3>Cookies indispensables</h3>
              <p>
                Cookies de navigation indispensables à l’utilisation du Site : gestion technique du réseau et facilitation de la communication
                par voie électronique (détection des erreurs de connexion, identification des points de connexion…).
              </p>

              <h3>Cookies de préférence</h3>
              <p>
                Permettent une navigation selon votre profil (entreprises, collectivités/institutionnel/journaliste) et le stockage de contenus en favoris.
              </p>

              <h3>Cookies d’authentification</h3>
              <p>Indispensables pour accéder à votre espace personnel depuis différents sites.</p>

              <h3>Cookies de performance</h3>
              <p>Utilisés pour :</p>
              <ul>
                <li>Analyser la fréquentation et l’utilisation du Site pour améliorer l’expérience et réaliser des études statistiques.</li>
                <li>Mémoriser les préférences d’affichage de votre navigateur et adapter la présentation du Site.</li>
                <li>Mettre en œuvre des mesures de sécurité.</li>
                <li>Améliorer la pertinence des annonces publicitaires.</li>
                <li>Rendre le Site plus convivial et interactif.</li>
              </ul>
            </section>

            <section>
              <h2>Cookies tiers</h2>
              <p>Les cookies utilisés sur le Site sont :</p>
              <ul>
                <li>Cookies de Rencontres et Territoires en Transitions.</li>
                <li>Cookies de tiers limitativement choisis par Rencontres et Territoires en Transitions pour atteindre des objectifs déterminés.</li>
              </ul>
              <p>
                Rencontres et Territoires en Transitions fait appel à des services tiers pour certaines fonctionnalités (partage de contenus,
                boutons de réseaux sociaux). Ces boutons dépendent de cookies tiers déposés directement par les réseaux sociaux (Twitter, YouTube, etc.).
              </p>
              <p>
                Ces réseaux sociaux peuvent vous identifier même sans interaction, si votre session est ouverte dans votre navigateur.
                Nous n’avons aucun contrôle sur leur collecte de données. Consultez leurs conditions d’utilisation pour plus d’informations.
              </p>
            </section>

            <section>
              <h2>Partage de l’utilisation de votre terminal</h2>
              <p>
                Si plusieurs personnes utilisent le même terminal ou différents navigateurs sur un même terminal, nous ne pouvons assurer que
                les services et publicités correspondent à votre usage personnel.
              </p>
            </section>

            <section>
              <h2>Consentement</h2>
              <p>
                Lors de votre première visite, il vous est proposé d’accepter ou de refuser certains cookies. En cas de refus, un cookie de refus
                est déposé pour enregistrer votre choix. Si vous supprimez ce cookie, votre refus ne sera plus enregistré.
              </p>
              <p>
                À l’acceptation, un cookie de consentement est installé. Vous pouvez modifier vos choix à tout moment via le lien « Gestion des cookies » en bas de page.
              </p>
            </section>

            <section>
              <h2>Gestion des cookies</h2>
              <h3 className="mTop20">7.1 Cookies de mesure d’audience strictement nécessaires</h3>
              <p>
                Notre site utilise des cookies de mesure d’audience anonymisés gérés par Eulerian. Exemptés de consentement selon la délibération CNIL n°2020-091,
                ils sont nécessaires au fonctionnement du site. Vous pouvez néanmoins vous y opposer :
              </p>
              <button id="eulerian-optout" className={`btn-eulerian-optout ${styles.btn}`}>
                Désactiver les cookies de la mesure d’audience strictement nécessaire
              </button>
              <p>Votre choix en matière de cookies est conservé 6 mois. Les données statistiques sont conservées 25 mois.</p>

              <h3>7.2 Autres cookies de mesure d’audience</h3>
              <p>
                Cookies soumis à votre consentement pour améliorer l’expérience utilisateur et suivre nos campagnes d’information.
              </p>
              <p>Gestion et modification :</p>
              <ul>
                <li>Sur le lien « Gestion des cookies » en bas de page du Site.</li>
                <li>À partir de votre logiciel de navigation.</li>
                <li>Via des plateformes interprofessionnelles d’opposition.</li>
              </ul>
              <p>
                Attention : le refus repose sur un cookie de refus. Si vous désactivez tous les cookies ou changez de terminal, votre refus ne sera pas conservé.
              </p>

              <h3>7.3 Paramétrages du navigateur</h3>
              <p>
                Vous pouvez configurer votre navigateur pour accepter, rejeter ou sélectionner les cookies selon leur émetteur. Vous pouvez aussi supprimer
                régulièrement les cookies via votre navigateur. Chaque navigateur a une configuration différente, consultable dans son menu d’aide.
              </p>
              <p>
                Note : en refusant les cookies, certaines fonctionnalités du Site peuvent être inaccessibles.
              </p>

              <h3>7.4 Plateformes interprofessionnelles d’opposition</h3>
              <p>
                Des plateformes comme {' '}
                <a href="http://www.youronlinechoices.com/fr/controler-ses-cookies/" target="_blank" rel="noopener noreferrer">
                  Your Online Choices
                </a>{' '}
                permettent de refuser ou accepter les cookies utilisés par leurs adhérents.
              </p>
            </section>

            <section>
              <h2>Protection des données personnelles</h2>
              <p>
                Rencontres et Territoires en Transitions, en tant que responsable du traitement, peut traiter des données personnelles via les cookies.
                Les cookies tiers dépendent de responsables externes soumis à leur propre politique de confidentialité.
              </p>
              <p>
                Les données collectées sont indispensables aux finalités de chaque cookie, destinées aux services habilités de
                Rencontres et Territoires en Transitions ou des tiers. Elles ne sont jamais conservées plus de 6 mois sans renouvellement de consentement.
              </p>
              <p>
                Conformément au RGPD, vous disposez d’un droit d’accès, rectification, effacement, opposition pour motifs légitimes et portabilité.
                Après votre décès, les données sont conservées pour respecter nos obligations légales puis effacées, sauf disposition contraire de votre part.
              </p>
              <p>
                Pour exercer vos droits, contactez le délégué à la protection des données par email ou courrier postal.
                En cas de litige, vous pouvez saisir la CNIL.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
