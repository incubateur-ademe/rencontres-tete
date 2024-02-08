import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Header.module.css'

export default function Header(){
    return (
        <>
            <div className={styles.Header}>
                <div className="boxed">
                    <div className="flex aligncenter space-between">
                        <div className="flex gap20 aligncenter">
                            <div className={styles.Logo}>
                                <img src="/republique-fr.png" className={styles.Logo} />
                            </div>     
                            <div className={styles.Logo}>
                                <img src="/logo-ademe.png" className={styles.Logo} />
                            </div>                          
                        </div>
                        <div className={styles.Menu}>
                            <ul>
                                <li><Link href="/">Accueil</Link></li>
                                <li><Link href="/">Toutes les rencontres</Link></li>
                                <li><Link href="/">Se connecter</Link></li>
                                <li><Link href="/">Créer un compte</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}