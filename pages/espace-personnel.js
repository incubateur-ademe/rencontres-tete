import Link from 'next/link'
import { useState, useEffect } from 'react'
import Rencontres from '/components/Rencontres'
import Profil from '@/components/Profil'
import styles from '@/styles/Account.module.css'

export default function Account(){

    const [page, setPage] = useState(0)

    return (
        <div className={styles.Account}>
            <div className="section blued">
                <div className="boxed">
                    <h1>Votre espace personnel</h1>
                    <div className={styles.Box}>
                        <div className="flex gap50">
                            <div className={`w20 ${styles.Sidebar}`}>
                                <ul>
                                    <li onClick={() => {setPage(0)}}><span className={page == 0 ? styles.active : undefined}>Mes rencontres</span></li>
                                    <li onClick={() => {setPage(1)}}><span className={page == 1 ? styles.active : undefined}>Mon profil</span></li>
                                    <li onClick={() => window.location.href = '/'}><span className={page == 2 ? styles.active : undefined}>Déconnexion</span></li>
                                </ul>
                            </div>
                            <div className="w80">
                                <div className={styles.Dash}>
                                    {page == 0 && (
                                        <Rencontres />
                                    )}
                                    {page == 1 && (
                                        <Profil />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}