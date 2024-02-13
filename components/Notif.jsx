import { useState, useEffect } from 'react'
import styles from '@/styles/Notif.module.css'

export function Notif({ datas, setNotif }){

    useEffect(() => {
        setTimeout(() => {
            setNotif(null)
        }, 2000)
    })
    
    return (
        <>
            <div className={styles.Notif}>
                <span className="material-icons">{datas.icon ? datas.icon : 'done'}</span>
                {datas.text}
            </div>
        </>
    )
}