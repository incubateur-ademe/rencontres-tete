import Link from 'next/link'
import styles from '@/styles/SessionBox.module.css'

export default function SessionBox({date, region, title, link, data, register, dept, see, detail}){
    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <span className={styles.Date}>{date}</span>
                    <span className={styles.Region}>{dept && `${dept} - `}{region}</span>
                </div>
                <div className="flex alignend gap40 mTop20">
                    <div className="w70">
                        <span className={styles.Title}>{title}</span>
                    </div>
                    {(register != 'false' && register != 'true') && (
                    <div className="w30">
                        <Link className={styles.Register} href={link}>S'inscrire</Link>
                    </div>
                    )}
                    {(see == 'true' && detail != "true") && (
                        <div className="w30 text-right">
                            <button className={styles.Register}>Voir plus</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}