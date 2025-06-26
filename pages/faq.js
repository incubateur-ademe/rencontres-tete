import Head from 'next/head'
import Link from 'next/link'
import prisma from '@/prisma';
import { useState, useEffect } from 'react'
import Verbatims from '@/components/Verbatims';
import styles from '@/styles/FAQ.module.css'

export default function Faq() {

    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        fetch('/api/faq/list')
        .then((res) => res.json())
        .then((data) => setFaqs(data.faqs))
        .catch((err) => console.error('Erreur FAQ:', err));
    }, []);


  return (
    <>
      <Head>
        <title>Les rencontres | ADEME</title>
      </Head>
      <div className={styles.Rencontres}>
        <div className="section blued">
          <div className="boxed">
            <h1>Foire aux questions</h1>
          </div>
        </div>

        <div className="section">
          <div className="boxed">
            <ul className={styles.faqList}>
                {faqs.map((faq) => (
                <li key={faq.id}>
                    <strong>{faq.question}</strong>
                    <p>{faq.reponse}</p>
                </li>
                ))}
            </ul>
          </div>
        </div>

        <Verbatims />

        <div className="section-top border-top">
          <div className="boxed">
            <div className="flex toColumn">
              <div className="w60 wm100">
                <h2><span className="orange">Créez un compte</span> ou connectez-vous pour vous inscrire aux rencontres dans votre région.</h2>
                <div className="flex aligncenter toColumn gap20 mTop30 mmLeft">
                  <Link href="/inscription" className="btn__normal btn__dark">S'inscrire à la plateforme</Link>
                  <Link href="/connexion" className="btn__normal btn__light">Se connecter</Link>
                </div>
              </div>
              <div className="w40 wm100">
                <img src="medias/inscription.webp" className="w100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}