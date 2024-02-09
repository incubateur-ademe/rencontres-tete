import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/Login.module.css'

export default function Login(){

    const [resetPass, setResetPass] = useState(false)

    return (
        <>
            <div className={styles.Login}>
                <div className="boxed">
                    <div className="flex justicenter">
                        <div className={styles.Logbox}>
                            <h1>Se connecter aux rencontres</h1>
                            <div className={styles.Box}>
                                {!resetPass ? (
                                    <>
                                        <div className="mBot20">
                                            <input type="mail" className="input-mail" placeholder="Adresse e-mail..." />
                                        </div>
                                        <div className="mBot20">
                                            <input type="password" className="input-text" placeholder="Mot de passe" />
                                        </div>
                                        <div className="flex flex-end gap10">
                                            <Link href="/inscription" className="btn__normal btn__light">
                                                Créer un compte
                                            </Link>
                                            <button className="btn__normal btn__dark">
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
        </>
    )
}