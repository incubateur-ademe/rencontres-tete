import Link from 'next/link'
import Head from 'next/head'
import nextCookies from 'next-cookies';
import Cookies from 'js-cookie';
import Alert from '@/components/Alert'
import { verifyToken } from '@/utils/auth';
import { useState, useEffect } from 'react'
import Rencontres from '/components/Rencontres'
import Profil from '@/components/Profil'
import styles from '@/styles/Account.module.css'

export async function getServerSideProps(context) {
    const { auth: token } = nextCookies(context);
    const user = verifyToken(token);
  
    if (!user) {
      return {
        redirect: {
          destination: '/connexion',
          permanent: false,
        },
      };
    }
  
    return { props: { user } };
}

export default function Account({ user }){

    console.log("ts")

    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState(null)

    const logout = async () => {
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            action: async () => {
                const unlog = await fetch('/api/logout')
                window.location.href = "/"
            }
        });

    }

    return (
        <>
        <div className={styles.Account}>
            <Head>
                <title>ADEME | Espace personnel</title>
            </Head>
            <div className="section blued">
                <div className="boxed">
                    <h1>Votre espace personnel</h1>
                    <div className={styles.Box}>
                        <div className="flex toColumn gap50 mgap20">
                            <div className={`w20 ${styles.Sidebar} wm100`}>
                                <ul>
                                    <li onClick={() => {setPage(0)}}><span className={page == 0 ? styles.active : undefined}>Mes rencontres</span></li>
                                    <li onClick={() => {setPage(1)}}><span className={page == 1 ? styles.active : undefined}>Mon profil</span></li>
                                    <li onClick={logout}><span className={page == 2 ? styles.active : undefined}>Déconnexion</span></li>
                                </ul>
                            </div>
                            <div className="w80 wm100">
                                <div className={styles.Dash}>
                                    {page == 0 && (
                                        <Rencontres user={user} />
                                    )}
                                    {page == 1 && (
                                        <Profil user={user} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {alert != null && (
            <Alert datas={alert} setAlert={setAlert} />
        )}  
        </>
    )
}