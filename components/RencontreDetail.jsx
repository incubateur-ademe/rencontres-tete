import Link from 'next/link'
import { useState, useEffect } from 'react'
import SessionBox from '@/components/SessionBox'
import Rating from '@mui/material/Rating';
import styles from '@/styles/Account.module.css'

export default function RencontreDetail({id, setOpen}){

    const [passed, setPassed] = useState(true)
    const [rating, setRating] = useState(4);
    const [data, setData] = useState({})

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const getUserSession = async () => {
        const fetcher = await fetch(`/api/sessions/${id}`)
        const json = await fetcher.json()
        setData(json[0])
    }

    useEffect(() => {
        getUserSession()
    }, [])

    console.log(data)

    return (
        <>
            <span onClick={() => setOpen(null)} className={styles.Back}>Retour à mes rencontres</span>
            <div className="w100 mTop25">
                <SessionBox 
                    date={formatDate(data.dateDebut)}
                    region={data.region}
                    title={data?.module?.nom}
                    register="false"
                />
            </div>
            <div className="flex alignstart gap30 mTop30">
                <div className="flex alignstart gap10 w35">
                    <div className="w7">
                        <img src="/medias/icon-lieu.png" alt="icon" className="w80" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Lieu de la rencontre :</span>
                        <span className={styles.dValue}>{data?.metasSession?.lieuRencontre}</span>
                    </div>
                </div>
                <div className="flex alignstart gap10 w20">
                    <div className="w10">
                        <img src="/medias/icon-date.png" alt="icon" className="w90" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Date :</span>
                        <span className={styles.dValue}>{formatDate(data?.dateDebut)}</span>
                    </div>
                </div>
                <div className="flex alignstart gap10 w20">
                    <div className="w10">
                        <img src="/medias/icon-date.png" alt="icon" className="w90" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Tarif :</span>
                        <span className={styles.dValue}>{data?.module?.metasModule?.tarif}</span>
                    </div>
                </div>
            </div>
            <span className={styles.Subtitle}>En savoir plus sur ce module :</span>
            <p>{data?.module?.description}</p>
            <span className={styles.Subtitle}>Ressources :</span>
            <ul className={styles.Ressources}>
                <li><Link target="_blank" href="/">PDF - Indications préalable à l'événement</Link></li>
                <li><Link target="_blank" href="/">PDF - Informations pratiques pour vous rendre à l'événement</Link></li>
                <li><Link target="_blank" href="/">PDF - Règlement intérieur</Link></li>
            </ul>   
            {passed && (
                <>
                    <span className={styles.Subtitle}>Donnez votre avis sur la rencontre :</span>
                    <div className="mTop15">
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            size="small"
                            onChange={(event, newValue) => {
                            setRating(newValue);
                            }}
                        />
                    </div>
                    <textarea className="textarea mTop15"></textarea>
                    <div className='mTop20 flex alignright'>
                        <button className="btn__normal btn__dark">Valider mon avis</button>
                    </div>
                </>
            )}     
        </>
    )
}