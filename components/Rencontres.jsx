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
        setLoad(true)
        const fetcher = await fetch(`/api/registrations/byUser/?userId=${user.id}&status=${status}`)
        const json = await fetcher.json()
        setRencontres(json)
        setLoad(false)
    }

    useEffect(() => {
        getUserSessions()
    }, [status])

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className={styles.Rencontres}>
            <div className={styles.Menu}>
                <button onClick={() => {setNav(0);setStatus('upcoming');setOpen(null)}} className={nav == 0 ? styles.active : undefined}>Mes rencontres à venir</button>
                <button onClick={() => {setNav(1);setStatus('old');setOpen(null)}} className={nav == 1 ? styles.active : undefined}>Mes rencontres passées</button>
            </div>
            {open == null ? (
            <>
                <div className="mTop30">
                    <button className="btn__normal btn__dark">Générer mon badge</button>
                </div>
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
                                    return (
                                        <div key={index} onClick={() => setOpen(rencontre.session.id)} className="w49 wm100">
                                            <SessionBox 
                                                date={formatDate(rencontre.session.dateDebut)}
                                                region={rencontre.session.region}
                                                title={rencontre.session.module.nom}
                                                register="false"
                                                see="true"
                                            />
                                        </div> 
                                    )
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
                    <RencontreDetail id={open} setOpen={setOpen} userId={user.id} />
                </div>
            )}
        </div>
    )
}