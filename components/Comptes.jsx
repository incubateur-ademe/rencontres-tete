import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import styles from '@/styles/Admin.module.css'

export default function Comptes(){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [create, setCreate] = useState(false)
    const [actions, setActions] = useState(1)
    const [account, setAccount] = useState({})
    const [listAccount, setListAccount] = useState([])

    useEffect(() => {
        const getAccounts = async () => {
            const geter = await fetch(`/api/accounts/`)
            const json = await geter.json()
            setListAccount(json)
        }
        getAccounts()
    }, [alert, actions])

    const handleChange = (e) => {
        const { name, type, value } = e.target
        setAccount(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const createAccount = async () => {
        const { email, type } = account
        if(email && type){
            const add = await fetch(`/api/accounts/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    type: type
                })
            })
            const json = await add.json()
            if(json.status == "success"){

                //reset
                setCreate(false)
                setAccount({})
                setActions(prev => prev+1)

                setNotif({
                    text: 'Le compte a bien été créé !',
                    icon: 'done'
                });
            }
            else{
                setNotif({
                    text: 'Cette adresse e-mail admin ou DR existe déjà !',
                    icon: 'close'
                });
            }
        }
        else{
            setNotif({
                text: 'Une information est manquante.',
                icon: 'close'
            });
        }
    }

    const preDeleteAccount = (id) => {
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sûr de vouloir supprimer ce compte ?',
            action: () => deleteAccount(id)
        });
    }

    const deleteAccount = async (id) => {
        const response = await fetch(`/api/accounts/delete/?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok){
            setNotif({
                text: 'Le compte a bien été supprimé.',
                icon: 'done'
            });            
        }
        setAlert(null)
    }

    return (
        <>
            <div className="flex aligncenter space-between w100 gap40">
                <span className={`${styles.Title} w65`}>Comptes administrateurs et DR</span>
                <button onClick={() => setCreate(prev => !prev)} className="btn__normal btn__dark">{create ? 'X' : 'Créer un compte'}</button>
            </div>
            {create && (
            <div>
                <div className="flex gap15">
                    <div className="w50 wm100">
                        <span className={styles.Subtitle}>Adresse e-mail du compte</span>
                        <input type="mail" name="email" onChange={handleChange} value={account.email} className="input-text w100 wm100" placeholder="Adresse e-mail" />  
                    </div>
                    <div className="w50 wm100">
                        <span className={styles.Subtitle}>Type de compte</span>
                        <div className="select w100">
                            <select onChange={handleChange} name="type" value={account.type} className="input-select">
                                <option value=''>Choisir un type de compte</option>
                                <option>Administrateur</option>
                                <option>DR</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div> 
                    </div>
                </div>
                <button onClick={createAccount} className="btn__normal btn__dark mTop15">Créer le compte</button>
            </div>
            )}
            {listAccount.length > 0 ? (
                <>
                    {listAccount.map((acc, i) => {
                        return (
                            <div className={`flex aligncenter space-between gap15 mTop15 ${styles.acc}`}>
                                <p>{acc.email}</p>
                                <div className="flex gap10 aligncenter">
                                    <span>{acc.type}</span>
                                    <button onClick={() => preDeleteAccount(acc.id)}>Supprimer</button>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                <>
                    <p>Aucun compte n'a été créé pour le moment.</p>
                </>
            )}

            {alert != null && (
                <Alert datas={alert} setAlert={setAlert} />
            )}  
            {notif != null && (
                <Notif datas={notif} setNotif={setNotif} />
            )}
        </>
    )
}