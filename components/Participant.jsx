import { Notif } from '@/components/Notif'
import Alert from '@/components/Alert'
import { useState, useEffect } from 'react'
import styles from '@/styles/Participants.module.css'

export default function Participant({ data, setActions }){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)

    const deleteUser = async () => {
        setAlert(null)
        const fetcher = await fetch(`/api/registrations/delete?userId=${data.userId}&sessionId=${data.sessionId}`, { method: 'DELETE' })
        const json = await fetcher.json()
        setActions(prev => prev+1)
    }

    const preDeleteUser = async () => {
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sûr de vouloir retirer ce participant ?',
            action: () => deleteUser()
        });
    }

    return (
        <>
            <div className={styles.User}>
                <div className="flex aligncenter gap10">
                    <span className={styles.UserName}><span className="material-icons">person</span>{data.nom} {data.prenom}</span>
                    <button onClick={preDeleteUser} className={styles.Corb}><span className="material-icons">delete</span></button>
                </div>               
                <div className={styles.Table}>
                    <div className="w22"><span className={styles.Label}>Nom</span>{data.nom}</div>
                    <div className="w22"><span className={styles.Label}>Prénom</span>{data.prenom}</div>
                    <div className="w30"><span className={styles.Label}>E-mail</span>{data.mail}</div>
                    <div className="w20"><span className={styles.Label}>Téléphone</span>{data.telephone ? data.telephone : '-'}</div>
                    <div className="w22"><span className={styles.Label}>Structure</span>INNOV'events</div>
                    <div className="w22"><span className={styles.Label}>Fonction</span>{data.structure}</div>
                    <div className="w30"><span className={styles.Label}>Type de fonction</span>{data.typeFonction}</div>
                    <div className="w20"><span className={styles.Label}>Ville</span>{data.ville ? data.ville : '-'}</div>
                    <div className="w22"><span className={styles.Label}>Transport</span>{data.transport}</div>
                    <div className="w22"><span className={styles.Label}>Repas</span>{data.repas ? 'Oui' : 'Non'}</div>
                    <div className="w30"><span className={styles.Label}>Besoin spécifique</span>{data.besoins != null ? data.besoins : '-'}</div>
                    <div className="w20"><span className={styles.Label}>Covoiturage</span>{data.covoit ? 'Oui' : 'Non'}</div>
                </div>
            </div>

            {notif != null && (
                <Notif datas={notif} setNotif={setNotif} />
            )}

            {alert != null && (
                <Alert datas={alert} setNotif={setAlert} />
            )}
        </>
    )
}