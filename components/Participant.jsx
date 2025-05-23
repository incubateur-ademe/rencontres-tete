import { Notif } from '@/components/Notif'
import Alert from '@/components/Alert'
import { useState, useEffect } from 'react'
import styles from '@/styles/Participants.module.css'

export default function Participant({ data, setActions, session }){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [role, setRole] = useState(data.role);


    const deleteUser = async () => {
        setAlert(null)
        const fetcher = await fetch(`/api/registrations/delete?userId=${data.userId ? data.userId : data.accountId}&sessionId=${data.sessionId}&${!data.userId && 'specialAccount=true'}`, { method: 'DELETE' })
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

    const generateBadge = async () => {
        setNotif({
            text: 'Le badge se génère, veuillez patienter...',
            icon: 'hourglass_top'
        }) 
        const datas = {
            nom: data.nom || data.mail,
            prenom: data.prenom || '[ADMIN / DR]',
            program: data.session.metasSession.programmeSession,
            organisation: data.user !== undefined && data.user.organisation || '',
        };

        const response = await fetch('/api/generate-badge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `badge_${data.nom}_${data.prenom}.pdf`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    const updateRole = async (registrationId, newRole, type) => {
        const res = await fetch('/api/registrations/updateRole', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId, role: newRole, type }),
        });
      
        if (res.ok) {
          setRole(newRole); // local update
          // 🔥 Ne pas appeler setActions ici
        } else {
          console.error('Erreur lors de la mise à jour du rôle');
        }
      };
      

    return (
        <>
            <div className={`${styles.User} ${data.deleted ? styles.Canceled : undefined}`}>
                <div className="flex aligncenter gap10">
                    <span className={styles.UserName}><span className="material-icons">{data.deleted ? 'cancel' : 'person'}</span>{data.nom} {data.prenom}</span>
                    {!data.deleted && (
                        <button onClick={preDeleteUser} className={styles.Corb}><span className="material-icons">delete</span></button>
                    )}    
                    <button onClick={generateBadge} className={styles.Corb}><span className="material-icons">picture_as_pdf</span></button>               
                </div>      
                <div className="mBot20">
                    <label>
                        <input
                        type="radio"
                        name={`role-${data.id}`}
                        value="participant"
                        checked={role === 'participant'}
                        onChange={() => updateRole(data.id, 'participant', !data.userId ? 'account' : 'user')}
                        /> Participant
                    </label>
                    <label style={{ marginLeft: '1rem' }}>
                        <input
                        type="radio"
                        name={`role-${data.id}`}
                        value="intervenant"
                        checked={role === 'intervenant'}
                        onChange={() => updateRole(data.id, 'intervenant', !data.userId ? 'account' : 'user')}
                        /> Intervenant
                    </label>
                    <label style={{ marginLeft: '1rem' }}>
                        <input
                        type="radio"
                        name={`role-${data.id}`}
                        value="organisateur"
                        checked={role === 'organisateur'}
                        onChange={() => updateRole(data.id, 'organisateur', !data.userId ? 'account' : 'user')}
                        /> Organisateur
                    </label>
                    </div>
         
                <div className={styles.Table}>
                    {data.nom ? (
                        <>
                            <div className="w22"><span className={styles.Label}>Nom</span>{data.nom}</div>
                            <div className="w22"><span className={styles.Label}>Prénom</span>{data.prenom}</div>
                            <div className="w30"><span className={styles.Label}>E-mail</span>{data.mail}</div>
                            <div className="w20"><span className={styles.Label}>Téléphone</span>{data.telephone ? data.telephone : '-'}</div>
                            <div className="w22"><span className={styles.Label}>Structure</span>{data.structure}</div>
                            <div className="w22"><span className={styles.Label}>Fonction</span>{data.fonction}</div>
                            <div className="w30"><span className={styles.Label}>Type de fonction</span>{data.typeFonction}</div>
                            <div className="w20"><span className={styles.Label}>Ville</span>{data.ville ? data.ville : '-'}</div>
                            <div className="w22"><span className={styles.Label}>Région</span>{data.region}</div>
                            <div className="w22"><span className={styles.Label}>Transport</span>{data.transport}</div>
                            <div className="w20"><span className={styles.Label}>Repas</span>{data.repas ? 'J1 : Oui' : 'J1 : Non'}{data.session.metasSession.nombreJours == 2 ? data.repas2 ? ' / J2 : Oui' : ' / J2 : Non' : ''}{data.regime ? ` (${data.regime})` : ''}</div>
                            <div className="w30"><span className={styles.Label}>Besoin spécifique</span>{data.besoins != null ? data.besoins : '-'}</div>
                            <div className="w20 mTop10"><span className={styles.Label}>Présence</span>{data.deleted ? 'Annulée' : data.days ? 'Complète' : '1/2'}</div>
                        </>
                    ) : (
                        <>
                            <div className="w30"><span className={styles.Label}>E-mail</span>{data.mail}</div>
                            <div className="w30"><span className={styles.Label}>Type</span>Admin/DR</div>
                            <div className="w20"><span className={styles.Label}>Présence</span>Complète</div>                        
                        </>
                    )} 
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