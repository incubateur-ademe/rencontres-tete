import Head from 'next/head'
import { useState, uesEffect } from 'react'
import nextCookies from 'next-cookies';
import { verifyToken } from '@/utils/auth';
import Modules from '@/components/Modules'
import Inscriptions from '@/components/Inscriptions'
import Sessions from '@/components/Sessions'
import styles from '@/styles/Admin.module.css'

export async function getServerSideProps(context) {
    const { auth: token } = nextCookies(context);
    const user = verifyToken(token);
  
    if (!user || user.id != 10) {
      return {
        redirect: {
          destination: '/connexion',
          permanent: false,
        },
      };
    }
  
    return { props: { user } };
}

export default function Admin({ user }){

    const [page, setPage] = useState(0)

    const logout = async () => {
        const unlog = await fetch('/api/logout')
        window.location.href = "/"
    }

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
                                        <li onClick={() => {setPage(1)}}><span className={page == 1 ? styles.active : undefined}>Inscriptions</span></li>
                                        <li onClick={logout}><span className={page == 2 ? styles.active : undefined}>Déconnexion</span></li>
                                    </ul>
                                </div>
                                <div className="w80">
                                    <div className={styles.Dash}>
                                        {page == 0 && (
                                            <Modules />
                                        )}
                                        {page == 1 && (
                                            <Inscriptions />
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