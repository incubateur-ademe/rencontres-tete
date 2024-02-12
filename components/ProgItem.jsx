import styles from '@/styles/Module.module.css'

export default function ({type, title, description}){
    return (
        <>
            <div className={styles.ProgItem}>
                <span className={styles.piType}>{type}</span>
                <span className={styles.piTitle}>{title}</span>
                <span className={styles.piDescription}>{description}</span>
            </div>
        </>
    )
}