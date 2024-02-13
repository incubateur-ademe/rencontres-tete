import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Notif } from '@/components/Notif'
import styles from '@/styles/Login.module.css'

export default function Register(){

    const [userDetails, setUserDetails] = useState({})
    const [notif, setNotif] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = async (event) => {
        const { name, type, checked, value } = event.target
        setUserDetails(prev => {
            return {
                ...prev,
                [name]: type == "checkbox" ? checked : value
            }
        })
    }

    const checkMail = async (mail) => {
        const fetcher = await fetch(`/api/users/lib/checkmail/?mail=${mail}`)
        const json = await fetcher.json()
        return json.exist
    }

    const createAccount = async () => {
        const { nom, prenom, mail, telephone, motDePasse, motDePasse2, fonction, newsletter, rgpd } = userDetails
        if(nom && prenom && mail && motDePasse && motDePasse2 && fonction && rgpd){
            if(motDePasse == motDePasse2){
                const mailExist = await checkMail(mail)
                if(!mailExist){
                    if(motDePasse.length > 5){

                        let userData = {
                            nom: nom,
                            prenom: prenom,
                            mail: mail,
                            telephone: telephone,
                            motDePasse: motDePasse,
                            fonction: fonction,
                            newsletter: newsletter ? true : false
                        }

                        const create = await fetch('/api/users/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({userData : userData})
                        })
                        const json = await create.json()
                        if(json.id){
                            setSuccess(true)
                        }
                    }
                    else{
                        setNotif({
                            text: 'Mot de passe trop court !',
                            icon: 'close'
                        })                         
                    }
                }
                else{
                    setNotif({
                        text: 'Cette adresse e-mail est déjà utilisée !',
                        icon: 'close'
                    })                      
                }
            }
            else{
                setNotif({
                    text: 'Les mots de passe ne sont pas identiques !',
                    icon: 'close'
                })                
            }
        }
        else{
            if(!rgpd){
                setNotif({
                    text: 'Veuillez accepter les CGV',
                    icon: 'close'
                })
            }
            else{
                setNotif({
                    text: 'Un ou plusieurs champ(s) manquant(s) !',
                    icon: 'close'
                })
            }
        }
    }

    return (
        <>
            <Head>
                <title>ADEME | Créer un compte</title>
            </Head>
            <div className={styles.Login}>
                <div className="boxed">
                    <div className="flex justicenter">
                        <div className={styles.Registerbox}>
                            {success ? (
                                <>
                                    <h1>Votre compte a bien été créé !</h1>
                                    <div className={styles.Box}>
                                        <div className="text-center">
                                            <span className={`material-icons ${styles.SuccessIcon}`}>rocket_launch</span>
                                            <span className={styles.Success}><strong>Félicitations, votre compte a bien été créé !</strong> Vous pouvez dès-à-présent vous connecter pour vous inscrire aux différentes rencontres disponibles.</span>
                                            <div className="mTop20">
                                                <Link className="btn__normal btn__dark" href="/connexion">Se connecter</Link>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1>Créez votre compte</h1>
                                    <div className={styles.Box}>
                                        <div className="flex gap20 mBot20">
                                            <input type="text" name="nom" onChange={handleChange} value={userDetails.nom} className="input-text" placeholder="Nom*" />
                                            <input type="text" name="prenom" onChange={handleChange} value={userDetails.prenom} className="input-text" placeholder="Prénom*" />
                                        </div>
                                        <div className="flex gap20 mBot20">
                                            <input type="mail" name="mail" onChange={handleChange} value={userDetails.mail} className="input-mail" placeholder="Adresse email*" />
                                            <input type="text" name="telephone" onChange={handleChange} value={userDetails.telephone} className="input-text" placeholder="Numéro de téléphone" />
                                        </div>
                                        <div className="flex gap20 mBot20">
                                            <input type="password" name="motDePasse" onChange={handleChange} value={userDetails.motDePasse} className="input-text" placeholder="Mot de passe*" />
                                            <input type="password" name="motDePasse2" onChange={handleChange} value={userDetails.motDePasse2} className="input-text" placeholder="Confirmez le mot de passe*" />
                                        </div>
                                        <div className="flex gap15 mBot30">
                                            <input type="text" name="fonction" onChange={handleChange} value={userDetails.fonction}  className="input-text" placeholder="Type de fonction*" />
                                        </div>
                                        <div className="mBot30">
                                            <div className="checkbox mBot20">
                                                <input type="checkbox" name="newsletter" onChange={handleChange} value={userDetails.newsletter}  /> <span>J’accepte de recevoir des actualités de l’ADEME. Vous pourrez vous désabonner à tout moment via le lien de désinscription en bas de nos e-mails.</span>
                                            </div>
                                            <div className="checkbox">
                                                <input type="checkbox" name="rgpd" onChange={handleChange} value={userDetails.rgpd} /> <span>J’ai lu et j’accepte que l’ADEME collecte mes données afin de garantir la bonne utilisation des services offerts*et reconnais avoir pris connaissance de sa politique de protection des données personnelles.</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-end gap10">
                                            <button onClick={createAccount} className="btn__normal btn__dark">
                                                Créer un compte
                                            </button>
                                        </div>
                                        <div className="alignright">
                                            <Link className="link mTop15" href="/connexion">Vous avez déjà un compte ?</Link>
                                        </div>                               
                                    </div>                                
                                </>
                            )}
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