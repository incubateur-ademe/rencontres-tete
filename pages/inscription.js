import Link from 'next/link'
import styles from '@/styles/Login.module.css'

export default function Register(){
    return (
        <>
            <div className={styles.Login}>
                <div className="boxed">
                    <div className="flex justicenter">
                        <div className={styles.Registerbox}>
                            <h1>Créez votre compte</h1>
                            <div className={styles.Box}>
                                <div className="flex gap20 mBot20">
                                    <input type="text" className="input-text" placeholder="Nom*" />
                                    <input type="text" className="input-text" placeholder="Prénom*" />
                                </div>
                                <div className="flex gap20 mBot20">
                                    <input type="mail" className="input-mail" placeholder="Adresse email*" />
                                    <input type="text" className="input-text" placeholder="Numéro de téléphone" />
                                </div>
                                <div className="flex gap20 mBot20">
                                    <input type="password" className="input-text" placeholder="Mot de passe*" />
                                    <input type="password" className="input-text" placeholder="Confirmez le mot de passe*" />
                                </div>
                                <div className="flex gap15 mBot30">
                                    <input type="text" className="input-text" placeholder="Type de fonction*" />
                                </div>
                                <div className="mBot30">
                                    <div className="checkbox mBot20">
                                        <input type="checkbox" /> <span>J’accepte de recevoir des actualités de l’ADEME. Vous pourrez vous désabonner à tout moment via le lien de désinscription en bas de nos e-mails.</span>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" /> <span>J’ai lu et j’accepte que l’ADEME collecte mes données afin de garantir la bonne utilisation des services offerts*et reconnais avoir pris connaissance de sa politique de protection des données personnelles.</span>
                                    </div>
                                </div>
                                <div className="flex flex-end gap10">
                                    <button className="btn__normal btn__dark">
                                        Créer un compte
                                    </button>
                                </div>
                                <div className="alignright">
                                    <Link className="link mTop15" href="/connexion">Vous avez déjà un compte ?</Link>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}