import Link from 'next/link'
import { useState, useEffect } from 'react'
import SessionBox from '@/components/SessionBox'
import Rating from '@mui/material/Rating';
import styles from '@/styles/Account.module.css'

export default function RencontreDetail({id, setOpen}){

    const [passed, setPassed] = useState(true)
    const [rating, setRating] = useState(4);

    return (
        <>
            <span onClick={() => setOpen(null)} className={styles.Back}>Retour à mes rencontres</span>
            <div className="w100 mTop25">
                <SessionBox 
                    date="21/02/2024"
                    region="Grand Est"
                    title="Énergie, eau et assainissement"
                    link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                    register="false"
                />
            </div>
            <div className="flex alignstart gap30 mTop30">
                <div className="flex alignstart gap10 w30">
                    <div className="w10">
                        <img src="/medias/icon-lieu.png" alt="icon" className="w70" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Lieu de la rencontre :</span>
                        <span className={styles.dValue}>2 Passage de l'Hôtel de ville, 68100 MULHOUSE</span>
                    </div>
                </div>
                <div className="flex alignstart gap10 w30">
                    <div className="w10">
                        <img src="/medias/icon-date.png" alt="icon" className="w70" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Date et horaires :</span>
                        <span className={styles.dValue}>21/02/2024 à 9h00</span>
                    </div>
                </div>
            </div>
            <span className={styles.Subtitle}>À faire avant la rencontre :</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse placerat vehicula orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras ac hendrerit neque, vitae vehicula sapien. Morbi fermentum, augue sed lacinia commodo, nisi libero maximus tellus, eleifend aliquet ligula eros eu massa.</p>
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