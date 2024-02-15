import { useState, useEffect } from 'react'
import styles from '@/styles/Reviews.module.css'

export default function Review({ data }){
    return (
        <>
            <div className={styles.ReviewUser}>
                <div className="flex aligncenter gap10">
                    <span className={styles.UserName}><span className="material-icons">person</span>{data.user.nom} {data.user.prenom}</span>
                    <span className={styles.UserName}><span className="material-icons">star</span>{data.note}/5</span>
                </div>
                <p className={styles.Rev}>
                    {data.commentaire}
                </p>
            </div>
        </>
    )
}