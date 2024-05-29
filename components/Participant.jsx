import { Notif } from '@/components/Notif'
import Alert from '@/components/Alert'
import { useState, useEffect } from 'react'
import styles from '@/styles/Participants.module.css'

export default function Participant({ data, setActions, session }){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)

    const deleteUser = async () => {
        setAlert(null)
        const fetcher = await fetch(`/api/registrations/delete?userId=${data.userId}&sessionId=${data.sessionId}`, { method: 'DELETE' })
        // const json = await fetcher.json()
        setActions(prev => prev+1)
    }

    const preDeleteUser = async () => {
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sûr de vouloir retirer ce participant ?',
            action: () => deleteUser(),
            setAlert: setAlert
        });
    }

    console.log(data.session.metasSession.nombreJours)

    return (
        <>
            <div className={`${styles.User} ${data.deleted ? styles.Canceled : undefined}`}>
                <div className="flex aligncenter gap10">
                    <span className={styles.UserName}><span className="material-icons">{data.deleted ? 'cancel' : 'person'}</span>{data.nom} {data.prenom}</span>
                    {!data.deleted && (
                        <button onClick={preDeleteUser} className={styles.Corb}><span className="material-icons">delete</span></button>
                    )}                   
                </div>               
                <div className={styles.Table}>
                    <div className="w22"><span className={styles.Label}>Nom</span>{data.nom}</div>
                    <div className="w22"><span className={styles.Label}>Prénom</span>{data.prenom}</div>
                    <div className="w30"><span className={styles.Label}>E-mail</span>{data.mail}</div>
                    <div className="w20"><span className={styles.Label}>Téléphone</span>{data.telephone ? data.telephone : '-'}</div>
                    <div className="w22"><span className={styles.Label}>Structure</span>{data.structure}</div>
                    <div className="w22"><span className={styles.Label}>Fonction</span>{data.fonction}</div>
                    <div className="w30"><span className={styles.Label}>Type de fonction</span>{data.typeFonction}</div>
                    <div className="w20"><span className={styles.Label}>Ville</span>{data.ville ? data.ville : '-'}</div>
                    <div className="w22"><span className={styles.Label}>Transport</span>{data.transport}</div>
                    <div className="w22"><span className={styles.Label}>Repas</span>{data.repas ? 'J1 : Oui' : 'J1 : Non'}{data.session.metasSession.nombreJours == 2 ? data.repas2 ? ' / J2 : Oui' : ' / J2 : Non' : ''}{data.regime ? ` (${data.regime})` : ''}</div>
                    <div className="w30"><span className={styles.Label}>Besoin spécifique</span>{data.besoins != null ? data.besoins : '-'}</div>
                    <div className="w20"><span className={styles.Label}>Présence</span>{data.deleted ? 'Annulée' : data.days ? 'Complète' : '1/2'}</div>
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