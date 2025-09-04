import { useState, useEffect } from 'react'
import styles from '@/styles/SessionStat.module.css'

export default function SessionStat({ session, setOpen }){

    const [number, setNumber] = useState(0)

    function formatDate(dateString) {
        if(dateString){
            const base = dateString.split('T');
            const [year, month, day] = base[0].split('-')
            return `${day}/${month}/${year}`;
        } else{
            return '---'
        }
    }    

    // Parse et formate une date en français en évitant COMPLÈTEMENT les problèmes de fuseau horaire
    function formatDateToFrench(dateString) {
        if (!dateString) return '---';

        let year, month, day;
        
        // Si c'est au format YYYY-MM-DD (cas des dateHoraires en BDD)
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            [year, month, day] = dateString.split('-');
        }
        // Si c'est au format DD/MM/YYYY
        else if (dateString.includes('/') && dateString.split('/').length === 3) {
            [day, month, year] = dateString.split('/');
        }
        // Si c'est une date ISO avec heure
        else if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
            const isoDate = new Date(dateString + (dateString.includes('T') ? '' : 'T12:00:00Z'));
            year = isoDate.getUTCFullYear();
            month = (isoDate.getUTCMonth() + 1).toString().padStart(2, '0');
            day = isoDate.getUTCDate().toString().padStart(2, '0');
        }
        else {
            return dateString; // Retourne le texte original si format non reconnu
        }

        // Conversion manuelle pour éviter tout problème de fuseau horaire
        const monthNames = [
            '', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        
        const monthIndex = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        
        return `${dayNum.toString().padStart(2, '0')} ${monthNames[monthIndex]} ${year}`;
    }

    // Utilise le texte des dates depuis la BDD mais les formate en français
    function getDateText(session) {
        // Si on a les données complètes de la session avec metasSession
        if (session?.metasSession?.dateHoraires) {
            const dateHoraires = session.metasSession.dateHoraires;
            // Formate la date en français
            return formatDateToFrench(dateHoraires);
        }
        
        // Fallback sur la date dateDebut si pas de dateHoraires
        if (session?.dateDebut) {
            return formatDateToFrench(session.dateDebut);
        }
        
        return '---';
    }

    function formatDate2(dateString) {
        if (!dateString) return '---';
    
        let date;
        if (dateString.includes('/')) {
            // Cas où la date est sous format "dd/mm/YYYY"
            const [day, month, year] = dateString.split('/');
            date = new Date(`${year}-${month}-${day}`); // Reformate en ISO
        } else {
            // Cas normal où la date est au format ISO
            date = new Date(dateString);
        }
    
        if (isNaN(date.getTime())) return 'Invalid Date';
    
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }


    const getParticipants = async () => {
        const fetcher = await fetch(`/api/registrations/bySession?sessionId=${session.id}`)
        const json = await fetcher.json()
        if(json.length > 0){
            setNumber(json.length)
        }
    }

    useEffect(() => {
        getParticipants()
    }, [session])

    const maintenant = new Date();
    const dateDebut = new Date(session.dateDebut);
    const differenceEnMs = dateDebut - maintenant;
    const joursRestants = Math.ceil(differenceEnMs / (1000 * 60 * 60 * 24));

    return (
        <>
            <div className={`${styles.SessionStat} mBot10`}>
                <div className="flex aligncenter space-between">
                    <div className="flex aligncenter gap15">
                        <span className={styles.Date}>{getDateText(session)} - <span className={styles.Restant}>{joursRestants >= 0 ? `${joursRestants} jour${joursRestants > 1 ? 's': ''} restant${joursRestants > 1 ? 's': ''}` : 'Terminée'}</span></span>
                        <span className={styles.Region}>{session.region}</span>
                    </div>
                    <span className={styles.LastMaj}>{number} participant{number > 1 && 's'}</span>
                </div>
                <div className="flex alignend space-between gap40 mTop20 w100">
                    <div className="w50">
                        <span className={styles.Title}>
                            <span>Module :</span>
                            {session.moduleName}
                        </span>
                    </div>
                    <div className="w50 flex alignend flex-end gap5">
                        <button onClick={() => {setOpen({ type: 'reviews', session: session })}} className={styles.Register}>Voir les avis</button>
                        <button onClick={() => {setOpen({ type: 'check', session: session })}} className={styles.Register}>Voir les participants</button>
                        <button onClick={() => {setOpen({ type: 'edit', session: session })}} className={styles.Register}>Infos</button>
                    </div>
                </div>
            </div>
        </>
    )
}