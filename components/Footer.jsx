import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Footer.module.css'

export default function Footer(){
    return (
        <>
            <div className={styles.Footer}>
                <div className="boxed">
                    <div className="flex toColumn">
                        <div className="w50 flex gap20 aligncenter wm100">
                            <div className={styles.Logo}>
                                <img src="/republique-fr.png" className={styles.Logo} />
                            </div>     
                            <div className={styles.Logo}>
                                <img src="/logo-ademe.png" className={styles.Logo} />
                            </div>                          
                        </div>
                        <div className="w50 wm100">
                            <p className={styles.MentionText}>Territoires en Transitions est une startup d'État portée par l'Agence de la Transition Écologique (ADEME) avec le soutien de l'Agence nationale de la Cohésion des Territoires.</p>
                            <div className="mTop30 flex gap30">
                                <Link href="https://www.ademe.fr/" target="_blank" className={styles.Link}>ademe.fr<span className="material-icons">open_in_new</span></Link>
                                <Link href="https://beta.gouv.fr/" target="_blank" className={styles.Link}>beta.gouv.fr<span className="material-icons">open_in_new</span></Link>
                            </div>
                        </div>
                    </div>
                    <div className={styles.Subfooter}>
                        <ul className="mwrap">
                            <li><Link href="https://rencontres.territoiresentransitions.fr/mentions-legales">Mentions légales</Link></li>
                            <li><Link href="https://rencontres.territoiresentransitions.fr/politique-donnees-personnelles/">Données personnelles</Link></li>
                            <li><a id="tarteaucitron" href="#tarteaucitron">Gestion des cookies</a></li>
                            <li><Link href="https://rencontres.territoiresentransitions.fr/politique-des-cookies">Politique des cookies</Link></li>
                            <li><Link href="https://www.territoiresentransitions.fr/cgu">Conditions générales d'utilisation</Link></li>
                            <li><Link href="https://www.territoiresentransitions.fr/accessibilite">Accessibilité</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}