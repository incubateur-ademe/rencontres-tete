import Link from 'next/link'
import styles from '@/styles/ModuleBox.module.css'

export default function ModuleBox({title}){
    return (
        <>
            <Link href="/" className={styles.Module}>
                <span className={styles.Title}>{title}</span>
                <span className={`${styles.Icon} material-icons`}>add</span>
            </Link>
        </>
    )
}