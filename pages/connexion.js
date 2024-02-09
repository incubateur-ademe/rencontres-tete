import Link from 'next/link'
import styles from '@/styles/Login.module.css'

export default function Login(){
    return (
        <>
            <div className={styles.Login}>
                <div className="boxed">
                    <div className="flex justicenter">
                        <div className={styles.Logbox}>
                            <h1>Se connecter aux rencontres</h1>
                            <div className={styles.Box}>
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
                                    <button className="link mTop15">Mot de passe oublié ?</button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}