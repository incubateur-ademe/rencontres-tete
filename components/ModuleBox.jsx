import Link from 'next/link'
import styles from '@/styles/ModuleBox.module.css'

export default function ModuleBox({title, link, theme}){
    return (
        <>
            <Link href={link} className={`${styles.Module} ${theme ? styles.ModuleHeight : undefined}`}>
                <span className={styles.Title}>{title}</span>
                {theme && (
                    <span className={styles.Theme}>{theme}</span>
                )}
                <span className={`${styles.Icon} material-icons`}>add</span>
            </Link>
        </>
    )
}