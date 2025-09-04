import Link from 'next/link'
import styles from '@/styles/SessionBox.module.css'

export default function SessionBox({date, moduleDuree, region, title, link, data, register, dept, see, detail, displayDept, model}){

    // Parse et formate une date en français en évitant COMPLÈTEMENT les problèmes de fuseau horaire
    function formatDateToFrench(dateString) {
        if (!dateString) return '---';
    
        let year, month, day;
        
        // Si c'est au format YYYY-MM-DD (cas des dateHoraires en BDD)
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            [year, month, day] = dateString.split('-');
        }
        // Si c'est au format DD/MM/YYYY
        else if (dateString.includes('/') && dateString.split('/').length === 3) {
            [day, month, year] = dateString.split('/');
        }
        // Si c'est une date ISO avec heure
        else if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
            const isoDate = new Date(dateString + (dateString.includes('T') ? '' : 'T12:00:00Z'));
            year = isoDate.getUTCFullYear();
            month = (isoDate.getUTCMonth() + 1).toString().padStart(2, '0');
            day = isoDate.getUTCDate().toString().padStart(2, '0');
        }
        else {
            return dateString; // Retourne le texte original si format non reconnu
        }
    
        // Conversion manuelle pour éviter tout problème de fuseau horaire
        const monthNames = [
            '', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        
        const monthIndex = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        
        return `${dayNum.toString().padStart(2, '0')} ${monthNames[monthIndex]} ${year}`;
    }

    // Utilise le texte des dates depuis la BDD mais les formate en français
    function getDateText(session, addDays = 0) {
        // Si on a les données complètes de la session avec metasSession
        if (session?.metasSession?.dateHoraires) {
            const dateHoraires = session.metasSession.dateHoraires;
            
            // Si c'est une session de 2 jours, essaye de détecter s'il y a déjà deux dates
            if (moduleDuree === '2 jours') {
                // Si le champ contient déjà les deux dates séparées par des séparateurs
                if (dateHoraires.includes(' - ') || dateHoraires.includes(' / ') || dateHoraires.includes(' au ')) {
                    return dateHoraires; // Utilise le texte tel quel s'il est déjà formaté
                }
                // Sinon, calcule la deuxième date
                const firstDate = formatDateToFrench(dateHoraires);
                const dateObj = new Date(session.dateDebut);
                dateObj.setUTCDate(dateObj.getUTCDate() + 1);
                const secondDate = dateObj.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC'
                });
                return `${firstDate} - ${secondDate}`;
            }
            
            // Pour une session d'un jour, formate la date en français
            return formatDateToFrench(dateHoraires);
        }
        
        // Fallback sur la date passée en paramètre
        return formatDateToFrench(date);
    }

    // Fonction pour générer le format de date pour l'URL (DD-MM-YYYY)
    function getUrlDateFormat(session) {
        // Priorité au champ dateHoraires si disponible
        if (session?.metasSession?.dateHoraires) {
            const dateHoraires = session.metasSession.dateHoraires;
            return formatDateForUrl(dateHoraires);
        }
        
        // Sinon utilise dateDebut de la session
        if (session?.dateDebut) {
            return formatDateForUrl(session.dateDebut);
        }
        
        // Fallback sur le paramètre date
        return formatDateForUrl(date);
    }

    function formatDateForUrl(dateString) {
        if (!dateString) return '';
        
        // Si c'est déjà une date formatée "DD/MM/YYYY", on la convertit directement
        if (dateString.includes('/') && dateString.split('/').length === 3) {
            return dateString.replaceAll('/', '-'); // DD/MM/YYYY -> DD-MM-YYYY
        } 
        
        // Pour les autres formats, on les convertit d'abord au format français puis on remplace les /
        let dateObj;
        if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
            const isoDate = new Date(dateString);
            dateObj = new Date(Date.UTC(isoDate.getFullYear(), isoDate.getMonth(), isoDate.getDate(), 12, 0, 0));
        } else {
            dateObj = new Date(dateString + 'T12:00:00Z');
        }
        
        if (isNaN(dateObj.getTime())) return '';
        
        // Utilise la même logique que formatDate dans index.js pour assurer la cohérence
        const frenchDate = dateObj.toLocaleDateString('fr-FR', { timeZone: 'UTC' });
        return frenchDate.replaceAll('/', '-'); // DD/MM/YYYY -> DD-MM-YYYY
    }
    

    
    

    return (
        <>
            <div className={styles.SessionBox}>
                <div className="flex aligncenter space-between">
                    <span className={styles.Date}>
                        {getDateText(data)}
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
                            <Link className={styles.Register} href={`/rencontres/${data?.module?.slug}/session-${getUrlDateFormat(data)}-${data?.region?.normalize("NFD")
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