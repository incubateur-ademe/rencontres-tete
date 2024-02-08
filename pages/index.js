import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.Home}>
      <Head>
        <title>Les Rencontres des Territoires Engagés</title>
      </Head>
      <div className="section">
        <div className="boxed">
          <div className="flex gap50">
            <div className="w50">
              <h1>Les Rencontres des Territoires Engagés</h1>
              <p>Participez aux Rencontres Territoire Engagé de l'ADEME organisées partout en France et montez en compétence sur les thématiques Climat Air Energie et Economie Circulaire, pour mettre en œuvre la transition écologique sur votre territoire.</p>
              <input className="input-text mTop30" type="text" placeholder="Rechercher une rencontre par nom, par date..." />
              <Link className="link mTop30" href="/">Voir toutes les rencontres à venir →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
