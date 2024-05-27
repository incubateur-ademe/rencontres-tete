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

    const publicationDate = formatDate(date);
    const lastUpdateDate = formatDate(lastUpdate);

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