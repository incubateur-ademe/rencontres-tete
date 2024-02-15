import styles from '@/styles/Participants.module.css'

export default function Participant({ data }){
    return (
        <>
            <div className={styles.User}>
                <span className={styles.UserName}><span className="material-icons">person</span>{data.nom} {data.prenom}</span>
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
        </>
    )
}