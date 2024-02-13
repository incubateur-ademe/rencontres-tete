import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/SessionsBack.module.css'

export default function SessionsBack({date, region, title, id, setOpen, setAlert, setActions, action, status}){

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const startDate = formatDate(date);

    const publish = async () => {
        try {
            const response = await fetch(`/api/sessions/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
    
            const result = await response.json();
            setAlert(null)
            setActions(prev => prev+1)
        } catch (error) {
            console.error('Erreur lors de la suppression du module:', error.message);
        }
    }

    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <div className="flex aligncenter gap15">
                        <span className={styles.Date}>{startDate}</span>
                    </div>
                    <span className={styles.Region}>{region}</span>
                </div>
                <div className="flex alignend space-between gap40 mTop20 w100">
                    <div className="w50">
                        <span className={styles.Title}><span>Module :</span>{title}</span>
                    </div>
                    <div className="w50 flex alignend flex-end gap5">
                        <button 
                            onClick={() => setAlert({
                                icon: 'warning',
                                text: 'Êtes-vous sûr de vouloir supprimer cette session ?',
                                action: action,
                                setAlert: setAlert
                            })}
                            className={styles.Corb}>
                            <span className="material-icons">delete</span>
                        </button>
                        <button onClick={() => setOpen({ id: id, type: 'edit', model: 'session', nom: title })} className={styles.Register}>Modifier la session</button>
                        {status == 'brouillon' && (
                            <button  
                                onClick={() => setAlert({
                                    icon: 'warning',
                                    text: 'Êtes-vous sûr de vouloir publier cette session ?',
                                    action: publish,
                                    setAlert: setAlert
                                })}
                                className={styles.Register}>
                                Publier
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}