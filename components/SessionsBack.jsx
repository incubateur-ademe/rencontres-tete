import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/SessionsBack.module.css'

export default function SessionsBack({date, region, title, id, setOpen, setAlert, action}){
    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <div className="flex aligncenter gap15">
                        <span className={styles.Date}>{date}</span>
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
                        <button onClick={() => setOpen({ id: id, type: 'edit', model: 'session' })} className={styles.Register}>Modifier la session</button>
                        <button  
                            onClick={() => setAlert({
                                icon: 'warning',
                                text: 'Êtes-vous sûr de vouloir publier cette session ?',
                                action: action,
                                setAlert: setAlert
                            })}
                            className={styles.Register}>
                            Publier
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}