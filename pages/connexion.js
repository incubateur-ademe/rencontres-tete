import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Notif } from '@/components/Notif'
import styles from '@/styles/Login.module.css'

export default function Login(){

    const [resetPass, setResetPass] = useState(false)
    const [notif, setNotif] = useState(null)
    const [userLogin, setUserLogin] = useState({ mail: '', motDePasse: '' })
    const router = useRouter();

    const handleChange = async (event) => {
        const { name, type, value } = event.target
        setUserLogin(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const login = async () => {
        const { mail, motDePasse } = userLogin;
        if (mail && motDePasse) {
            const test = await fetch(`/api/users/lib/auth/?mail=${mail}&motDePasse=${motDePasse}`);
            const json = await test.json();
            if (json.success == true) {
                    
                    const jwtResponse = await fetch(`/api/users/lib/jwt`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: json.user.id, mail: json.user.mail }),
                    });
                
                    const jwtJson = await jwtResponse.json();
                    if(jwtJson){
                        router.push('/espace-personnel');
                    }
                    
                } else {
                    setNotif({
                        text: 'Identifiant ou mot de passe invalide(s)',
                        icon: 'close'
                    });
                }
                
            }
        else {
            setNotif({
                text: 'Veuillez remplir tous les champs !',
                icon: 'close'
            });
        }
    };
    

    return (
        <>
            <Head>
                <title>ADEME | Connexion</title>
            </Head>
            <div className={styles.Login}>
                <div className="boxed">
                    <div className="flex justicenter">
                        <div className={styles.Logbox}>
                            <h1>Se connecter aux rencontres</h1>
                            <div className={styles.Box}>
                                {!resetPass ? (
                                    <>
                                        <div className="mBot20">
                                            <input type="mail" name="mail" onChange={handleChange} value={userLogin.mail} className="input-mail" placeholder="Adresse e-mail..." />
                                        </div>
                                        <div className="mBot20">
                                            <input type="password" name="motDePasse" onChange={handleChange} value={userLogin.motDePasse} className="input-text" placeholder="Mot de passe" />
                                        </div>
                                        <div className="flex flex-end gap10">
                                            <Link href="/inscription" className="btn__normal btn__light">
                                                Créer un compte
                                            </Link>
                                            <button onClick={login} className="btn__normal btn__dark">
                                                Se connecter
                                            </button>
                                        </div>
                                        <div className="alignright">
                                            <button className="link mTop15" onClick={(() => setResetPass(prev => !prev))}>Mot de passe oublié ?</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2>Réinitialisez votre mot de passe</h2>
                                        <div className="mBot20 mTop20">
                                            <input type="mail" className="input-mail" placeholder="Adresse e-mail..." />
                                        </div>
                                        <div className="flex flex-end gap10">
                                            <button onClick={(() => setResetPass(prev => !prev))} className="btn__normal btn__light">
                                                Revenir à la connexion
                                            </button>
                                            <button className="btn__normal btn__dark">
                                                Valider
                                            </button>
                                        </div>
                                    </>
                                )}                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {notif != null && (
                <Notif datas={notif} setNotif={setNotif} />
            )}
        </>
    )
}