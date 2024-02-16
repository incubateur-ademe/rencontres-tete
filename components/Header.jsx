import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Header.module.css'

export default function Header(){

    const [user, setUser] = useState(null);
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth')
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            if (data.isAuthenticated) {
              setUser(data.user);
            } else {
              setUser(null);
            }
          });
    }, [router.asPath]);

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
                                <li><Link href="/rencontres">Toutes les rencontres</Link></li>
                                {user?.id ? (
                                    <>
                                        {user.id == 10 ? (
                                            <li><Link href="/admin">Administration</Link></li>
                                        ) : (
                                            <li><Link href="/espace-personnel">Espace personnel</Link></li>
                                        )}
                                    </>                                    
                                ) : (
                                    <>
                                        <li><Link className={styles.LinkFunction} href="/connexion">Se connecter</Link></li>
                                        <li><Link className={styles.LinkFunction} href="/inscription">Créer un compte</Link></li>
                                    </>
                                )}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}