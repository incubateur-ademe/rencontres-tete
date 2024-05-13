import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/ModuleBox.module.css'

export default function ModuleBox({title, link, theme, pilier, length}){
   
    const [sess, setSess] = useState(0)

    useEffect(() => {
        if(length){
            length.map((session, i) => {
                if(session.status == 'publish'){
                    setSess(prev => prev+1)
                }
            })
        }
    }, [])

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
                {sess > 0 ? (
                    <span className={styles.Dispos}>{length.length} rencontre{length.length > 1 ? 's' : ''} disponible{length.length > 1 ? 's' : ''}</span>
                ) : (
                    <span className={styles.Soon}>Rencontres à venir</span>
                )}
            </Link>
        </>
    )
}