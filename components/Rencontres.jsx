import Link from 'next/link'
import { useState, useEffect } from 'react'
import SessionBox from '@/components/SessionBox'
import RencontreDetail from '@/components/RencontreDetail'
import styles from '@/styles/Account.module.css'

export default function Rencontres({ user }){

    const [nav, setNav] = useState(0)
    const [open, setOpen] = useState(null)
    const [rencontres, setRencontres] = useState([])
    const [status, setStatus] = useState('upcoming')
    const [load, setLoad] = useState(false)


    const getUserSessions = async () => {
        if(user.type == "Administrateur" || user.type == "DR"){
            setLoad(true)
            const fetcher = await fetch(`/api/registrations/byUser/?userId=${user.id}&status=${status}&specialAccount=true`)
            const json = await fetcher.json()
            setRencontres(json)
            setLoad(false)
        } else {
            setLoad(true)
            const fetcher = await fetch(`/api/registrations/byUser/?userId=${user.id}&status=${status}`)
            const json = await fetcher.json()
            setRencontres(json)
            setLoad(false)
        }
    }

    useEffect(() => {
        getUserSessions()
    }, [status, open])

    function formatDate(dateString) {
        if (!dateString) return '---';
    
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
    
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    }
    

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
    function getDateText(session) {
        // Si on a les données complètes de la session avec metasSession
        if (session?.metasSession?.dateHoraires) {
            const dateHoraires = session.metasSession.dateHoraires;
            // Formate la date en français
            return formatDateToFrench(dateHoraires);
        }
        
        // Fallback sur la date dateDebut si pas de dateHoraires
        if (session?.dateDebut) {
            return formatDateToFrench(session.dateDebut);
        }
        
        return '---';
    }

    function formatDate2(dateString) {

        if (!dateString) return '---';
    
        let date;
    
        if (dateString.includes('/')) {
            // Format "dd/mm/YYYY"
            const [day, month, year] = dateString.split('/');
            date = new Date(`${year}-${month}-${day}T00:00:00`);
        } else {
            // Format ISO ou autre
            date = new Date(dateString);
        }

   
    
        if (isNaN(date.getTime())) return 'Invalid Date';
    
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
    


    return (
        <div className={styles.Rencontres}>
            <div className={styles.Menu}>
                <button onClick={() => {setNav(0);setStatus('upcoming');setOpen(null)}} className={nav == 0 ? styles.active : undefined}>Mes rencontres à venir</button>
                <button onClick={() => {setNav(1);setStatus('old');setOpen(null)}} className={nav == 1 ? styles.active : undefined}>Mes rencontres passées</button>
            </div>
            {open == null ? (
            <>
                {load ? (
                    <>
                        <div className="mTop30">
                            <span>Chargement des rencontres...</span>
                        </div>
                    </>
                ) : (
                    <>
                        {rencontres.length > 0 ? (
                            <div className="flex gap15 wrap mTop30">
                                {rencontres.map((rencontre, index) => {
                                    if(rencontre.deleted == false || rencontre.deleted == undefined){
                                    return (
                                        <div key={index} onClick={() => setOpen({sessionId: rencontre.session.id, registrationId: rencontre.id})} className="w49 wm100">
                                            <SessionBox 
                                                date={rencontre.session.dateDebut}
                                                region={rencontre.session.region}
                                                dept={rencontre.session.departement}
                                                title={rencontre.session.module.nom}
                                                register="false"
                                                see="true"
                                                user={user}
                                            />
                                        </div> 
                                    )
                                    }
                                })}
                            </div>
                        ) : (
                            <div className="mTop30">
                                <span>Vous n'avez aucune rencontre {status == 'upcoming' ? 'à venir' : 'passée'}.</span>
                            </div>
                        )}
                    </>
                )}
            </>
            ) : (
                <div className="mTop20">
                    <RencontreDetail id={open.sessionId} setOpen={setOpen} user={user} userId={user.id} registrationId={open.registrationId}  />
                </div>
            )}
        </div>
    )
}