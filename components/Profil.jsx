import { useState, useEffect } from 'react'
import { Notif } from '@/components/Notif'
import Alert from '@/components/Alert'
import styles from '@/styles/Account.module.css'

export default function Profil({ user }){

    const [userData, setUserData] = useState(null)
    const [actions, setActions] = useState(0)
    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [passw, setPassw] = useState({ motDePasse: '', motDePasse2: '' })
    const [rgpd, setRgpd] = useState(false)
    
    const getUserInfos = async () => {
        if(user.type == "Administrateur" || user.type == "DR"){
            const geter = await fetch(`/api/accounts/${user.id}`)
            const json = await geter.json()
            setUserData(json[0])
        } else {
            const geter = await fetch(`/api/users/${user.id}`)
            const json = await geter.json()
            setUserData(json[0])
        }
    }

    const handleChange = async (event) => {
        const { name, type, value } = event.target
        setUserData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleChangePass = async (event) => {
        const { name, type, value } = event.target
        setPassw(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const changePassword = async () => {
        const { motDePasse, motDePasse2 } = passw
        if(motDePasse && motDePasse2){
            if(motDePasse.length > 5){
                if(user.type == "Administrateur" || user.type == "DR"){
                    // const fetcher = await fetch('/api/accounts/lib/update-password', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({
                    //         motDePasse: motDePasse,
                    //         userId: user.id
                    //     })
                    // })
                    // const json = await fetcher.json();
                    // if(json.id){
                    //     setNotif({
                    //         text: 'Le mot de passe a bien été modififé !',
                    //         icon: 'done'
                    //     })                      
                    // }
                } else {
                    const fetcher = await fetch('/api/users/lib/update-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            motDePasse: motDePasse,
                            userId: user.id
                        })
                    })
                    const json = await fetcher.json();
                    if(json.id){
                        setNotif({
                            text: 'Le mot de passe a bien été modififé !',
                            icon: 'done'
                        })                      
                    }
                }
            }
            else{
                setNotif({
                    text: 'Le mot de passe est trop court',
                    icon: 'close'
                })                  
            }
        }
        else{
            setNotif({
                text: 'Veuillez remplir les 2 champs !',
                icon: 'close'
            })  
        }
    }

    const deleteAccount = async () => {
        if(rgpd){
            try {
                if(user.type == "Administrateur" || user.type == "DR"){
                    // const response = await fetch(`/api/accounts/delete/?id=${user.id}`, {
                    //     method: 'DELETE',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    // });
            
                    // if (!response.ok) {
                    //     throw new Error(`Erreur HTTP: ${response.status}`);
                    // }
            
                    // const result = await response.json();
                    // const unlog = await fetch('/api/logout')
                    
                    // window.location.href = "/"
                } else {
                    const response = await fetch(`/api/users/delete/?id=${user.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
            
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
            
                    const result = await response.json();
                    const unlog = await fetch('/api/logout')
                    
                    window.location.href = "/"
                }

            } catch (error) {
                console.error('Erreur lors de la suppression de la session:', error.message);
            }
        }
        else{
            setNotif({
                text: 'Veuillez cocher la case obligatoire.',
                icon: 'close'
            })  
            setAlert(null)            
        }
    }

    useEffect(() => {
        getUserInfos()
    }, [])

    return (
        <>
        <div className={styles.Profil}>
            <span className={styles.Title}>Vos informations personnelles</span>
            {user.type != "Administrateur" && user.type != "DR" ? (
                <>
                    <div className="mTop30">
                        <div className="flex gap20 toColumn wm100">
                            <input disabled type="text" name="nom" onChange={handleChange} value={userData?.nom} className="input-text w50 wm100" placeholder="Nom" />
                            <input disabled type="text" name="prenom" onChange={handleChange} value={userData?.prenom} className="input-text w50 wm100" placeholder="Prénom" />
                        </div>
                        <div className="flex gap20 mTop20 toColumn">
                            <input disabled type="mail" name="mail" onChange={handleChange} value={userData?.mail} className="input-mail w50 wm100" placeholder="Adresse e-mail" />
                            <input disabled type="text" name="telephone" onChange={handleChange} value={userData?.telephone} className="input-text w50 wm100" placeholder="Numéro de téléphone" />
                        </div>
                    </div>                
                </>
            ) : (
                <div className="mTop30">
                    <div className="flex gap20 mTop20 toColumn">
                        <input disabled type="mail" name="mail" onChange={handleChange} value={userData?.email} className="input-mail w50 wm100" placeholder="Adresse e-mail" />
                    </div>
                </div>  
            )}
            <span className={styles.Subtitle}>Vous souhaitez modifier votre mot de passe ?</span>
            <div className="mTop30">
                <div className="flex gap20 toColumn">
                    <input type="password" name="motDePasse" onChange={handleChangePass} value={passw.motDePasse} className="input-text w50 wm100" placeholder="Nouveau mot de passe" />
                    <input type="password" name="motDePasse2" onChange={handleChangePass} value={passw.motDePasse2} className="input-text w50 wm100" placeholder="Confirmez votre mot de passe*" />
                </div>
                <div className="flex alignright mTop20">
                    <button onClick={changePassword} className="btn__normal btn__dark">Modifier le mot de passe</button>
                </div>
            </div>
            <div className={styles.DeleteAccount}>
                <span className={styles.Subtitle}>Vous souhaitez supprimer votre compte ?</span>
                <div className="checkbox mTop30">
                    <input name="rgpd" value={rgpd} onChange={() => setRgpd(prev => !prev)} type="checkbox" /> <span>Je confirme ma demande de suppression de mon compte et de toutes mes données associées.</span>
                </div>
                <div className="flex mTop20">
                    <button 
                        onClick={() => setAlert({
                                icon: 'warning',
                                text: 'Êtes-vous sûr de vouloir supprimer votre compte ?',
                                action: deleteAccount,
                                setAlert: setAlert
                        })} 
                        className="btn__normal btn__dark">
                        Supprimer mon compte
                    </button>
                </div>
            </div>
        </div>
        
        {notif != null && (
            <Notif datas={notif} setNotif={setNotif} />
        )}
        {alert != null && (
            <Alert datas={alert} setAlert={setAlert} />
        )}  

        </>
    )
}