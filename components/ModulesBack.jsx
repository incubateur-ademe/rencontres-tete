import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/ModuleBack.module.css'

export default function ModulesBack({date, code, lastUpdate, category, title, id, setOpen, setAlert, action, sessions, user}){

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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


    const publicationDate = formatDateToFrench(date);
    const lastUpdateDate = formatDateToFrench(lastUpdate);

    const now = new Date();

    const nbSession = sessions.filter((session) => {
        const dateDebut = new Date(session.dateDebut);
        return dateDebut > now;
    }).length;
      
    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <div className="flex aligncenter gap15">
                        <span className={styles.Date}>Publié le {publicationDate}</span>
                        <span className={styles.Region}>{category}</span>
                    </div>
                    <span className={styles.LastMaj}>Code module : #{code}</span>
                </div>
                <div className="flex alignend space-between gap40 mTop20 w100">
                    <div className="w50">
                        <span className={styles.Title}><span>Module ({nbSession} session{nbSession > 1 ? 's' : ''} à venir) :</span>{title}</span>
                    </div>
                    <div className="w50 flex alignend flex-end gap5">
                        {user.type != 'DR' && (
                            <>
                                <button 
                                    onClick={() => setAlert({
                                        icon: 'warning',
                                        text: 'Êtes-vous sûr de vouloir supprimer ce module ?',
                                        action: action,
                                        setAlert: setAlert
                                    })}
                                    className={styles.Corb}>
                                    <span className="material-icons">delete</span>
                                </button>
                                <button onClick={() => setOpen({ id: id, type: 'edit', model: 'module' })} className={styles.Register}>Modifier</button>    
                            </>
                        )}
                        <button onClick={() => setOpen({ id: id, type: 'sessions', model: 'session', nom: title })} className={styles.Register}>Voir les sessions</button>
                    </div>
                </div>
            </div>
        </>
    )
}