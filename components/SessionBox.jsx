import Link from 'next/link'
import styles from '@/styles/SessionBox.module.css'

export default function SessionBox({date, moduleDuree, region, title, link, data, register, dept, see, detail, displayDept, model}){

    function formatDate(dateString, addDays = 0) {
        if (!dateString) return '---';
    
        let date;
        if (dateString.includes('/')) {
            // Gestion du format "dd/mm/YYYY"
            const [day, month, year] = dateString.split('/');
            date = new Date(`${year}-${month}-${day}T00:00:00`);
        } else {
            // Format ISO standard
            date = new Date(dateString);
        }
    
        if (isNaN(date.getTime())) return 'Invalid Date';
    
        // Ajout de jours si nécessaire
        if (addDays > 0) {
            date.setDate(date.getDate() + addDays);
        }
    
        // Formatage selon le fuseau horaire local du navigateur
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
    

    
    

    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <span className={styles.Date}>
                        {moduleDuree === '2 jours'
                            ? `${formatDate(date)} / ${formatDate(date, 1)}` 
                            : formatDate(date)}
                    </span>
                    <span className={styles.Region}>{displayDept != "no" ? dept && `${dept} - ` : ''}{region}</span>
                </div>
                <div className="flex alignend gap40 mTop20">
                    <div className="w70">
                        <span className={styles.Title}>{title}</span>
                    </div>
                    {(register != 'false' && register != 'true') && (
                    <div className={`w30 ${model == "full" && "text-right"}`}>
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