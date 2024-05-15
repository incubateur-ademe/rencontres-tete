import Link from 'next/link'
import styles from '@/styles/SessionBox.module.css'

export default function SessionBox({date, region, title, link, data, register, dept, see, detail}){

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    console.log(data)

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
                    {(see == 'true' && detail != "yes") && (
                        <div className="w30 text-right">
                            <button className={styles.Register}>Voir plus</button>
                        </div>
                    )}
                    {detail == "yes" && (
                        <div className="w30 text-right">
                            <Link className={styles.Register} href={`/rencontres/${data?.module?.slug}/session-${formatDate(data?.dateDebut).replaceAll('/', '-')}-${data?.region?.normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "")
                                        .replace(/[.,]/g, "")
                                        .replace(/\s+/g, '-')
                                        .toLowerCase()}`}>Voir plus</Link>
                        </div>                        
                    )}
                </div>
            </div>
        </>
    )
}