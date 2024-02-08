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
          <div className="flex aligncenter gap50">
            <div className="w50">
              <h1>Les Rencontres des Territoires Engagés</h1>
              <p>Participez aux Rencontres Territoire Engagé de l'ADEME organisées partout en France et montez en compétence sur les thématiques Climat Air Energie et Economie Circulaire, pour mettre en œuvre la transition écologique sur votre territoire.</p>
              <input className="input-text mTop30" type="text" placeholder="Rechercher une rencontre par nom, par date..." />
              <Link className="link mTop30" href="/">Voir toutes les rencontres à venir →</Link>
            </div>
            <div className="w50">
              <img src="/medias/Meeting.png" alt="les rencontres des territoires engagés" className="w100" />
            </div>
          </div>
        </div>
      </div>
      <div className="section border-top">
        <div className="boxed">
          <div className="flex gap50 aligncenter">
            <div className="w50">

            </div>
            <div className="w50">
              <h2>Découvrez les rencontres à venir dans votre région</h2>
              <ul className={styles.Regions}>
                <li><Link href="/"><span className="material-icons">room</span>Auvergne-Rhône-Alpes</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Bourgogne-Franche-Comté</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Bretagne</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Centre-Val de Loire</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Corse</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Normandie</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Nouvelle-Aquitaine</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Occitanie</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Grand-Est</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Hauts-de-France</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Île-de-France</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Pays de la Loire</Link></li>
                <li><Link href="/"><span className="material-icons">room</span>Provence-Alpes-Côte d'Azur</Link></li>
              </ul>
              <Link href="/" className="btn__normal btn__dark">Voir toutes les rencontres</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
