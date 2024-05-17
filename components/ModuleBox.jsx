import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/ModuleBox.module.css'

export default function ModuleBox({title, link, theme, pilier, length, coming}){
   
    const [sess, setSess] = useState(0)

    useEffect(() => {
        if(length && length.length > 0){
            length.forEach((session) => {
                let dateDebut = new Date(session.dateDebut);
                let now = new Date();
                if(session.status === 'publish' && dateDebut >= now){
                    setSess(prev => prev + 1);
                }
            });
        }
    }, [length]);    

    return (
        <>
            <Link href={link} className={`${styles.Module} ${theme ? styles.ModuleHeight : undefined}`}>
                <span className={styles.Title}>{title}</span>
                {theme && (
                    <span className={styles.Theme}>{theme}</span>
                )}
                {pilier && (
                    <span className={styles.Theme}>{pilier}</span>
                )}
                <span className={`${styles.Icon} material-icons`}>add</span>
                {(!coming == "not" || coming == undefined) && (
                    (sess > 0 && length.length > 0) ? (
                        <span className={styles.Dispos}>{length.length} rencontre{length.length > 1 ? 's' : ''} disponible{length.length > 1 ? 's' : ''}</span>
                    ) : (
                        <span className={styles.Soon}>Rencontres à venir</span>
                    )
                )}
            </Link>
        </>
    )
}