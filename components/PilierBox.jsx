import Link from 'next/link'
import styles from '@/styles/PilierBox.module.css'

export default function PilierBox({title, description, link, pic}){
    return (
        <>
            <div className={styles.Pilier}>
                <img src={`/medias/${pic}`} className={styles.Media} />
                <h3>{title}</h3>
                <p className="w100">{description}</p>
                <Link href={link} className="btn__small btn__dark">Découvrir les rencontres</Link>
            </div>
        </>
    )
}