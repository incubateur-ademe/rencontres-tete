import Link from 'next/link'
import styles from '@/styles/PilierBox.module.css'

export default function PilierBox({title, description, link, pic, setFiltres, active}){
    return (
        <>
            <div className={`${styles.Pilier} ${(active == title) ? undefined : (active != '' && active) ? styles.NoActive : undefined}`}>
                <img src={`/medias/${pic}`} className={styles.Media} />
                <h3>{title}</h3>
                <p className="w100">{description}</p>
                {link ? (
                    <Link href={link} className="btn__normal btn__dark">Découvrir les modules</Link>
                ) : (
                    <button onClick={(event) => setFiltres(prev => { return { ...prev, nom: '', pilier: title } })} className="btn__small btn__dark">Découvrir les modules</button>
                )}
            </div>
        </>
    )
}