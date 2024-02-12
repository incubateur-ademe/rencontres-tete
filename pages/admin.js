import Head from 'next/head'
import { useState, uesEffect } from 'react'
import Modules from '@/components/Modules'
import styles from '@/styles/Admin.module.css'

export default function Admin(){

    const [page, setPage] = useState(0)

    return (
        <>
            <div className={styles.Account}>
                <Head>
                    <title>ADEME | Tableau de bord</title>
                </Head>
                <div className="section blued">
                    <div className="boxed">
                        <h1>Tableau de bord</h1>
                        <div className={styles.Box}>
                            <div className="flex gap50">
                                <div className={`w20 ${styles.Sidebar}`}>
                                    <ul>
                                        <li onClick={() => {setPage(0)}}><span className={page == 0 ? styles.active : undefined}>Modules</span></li>
                                        <li onClick={() => {setPage(1)}}><span className={page == 1 ? styles.active : undefined}>Sessions</span></li>
                                        <li onClick={() => window.location.href = '/'}><span className={page == 2 ? styles.active : undefined}>Déconnexion</span></li>
                                    </ul>
                                </div>
                                <div className="w80">
                                    <div className={styles.Dash}>
                                        {page == 0 && (
                                            <Modules />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}