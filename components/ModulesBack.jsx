import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/ModuleBack.module.css'

export default function ModulesBack({date, category, title, id, setOpen, setAlert, action}){
    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <div className="flex aligncenter gap15">
                        <span className={styles.Date}>Publié le {date}</span>
                        <span className={styles.Region}>{category}</span>
                    </div>
                    <span className={styles.LastMaj}>Date de dernière mise à jour : 21/10/2023</span>
                </div>
                <div className="flex alignend space-between gap40 mTop20 w100">
                    <div className="w50">
                        <span className={styles.Title}><span>Module :</span>{title}</span>
                    </div>
                    <div className="w50 flex alignend flex-end gap5">
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
                        <button onClick={() => setOpen({ id: 123, type: 'edit' })} className={styles.Register}>Modifier</button>
                        <button onClick={() => setOpen({ id: 123, type: 'sessions' })} className={styles.Register}>Sessions</button>
                    </div>
                </div>
            </div>
        </>
    )
}