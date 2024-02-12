import Link from 'next/link'
import { useState, useEffect } from 'react'
import SessionBox from '@/components/SessionBox'
import RencontreDetail from '@/components/RencontreDetail'
import styles from '@/styles/Account.module.css'

export default function Rencontres(){

    const [nav, setNav] = useState(0)
    const [open, setOpen] = useState(null)

    return (
        <div className={styles.Rencontres}>
            <div className={styles.Menu}>
                <button onClick={() => {setNav(0);setOpen(null)}} className={nav == 0 ? styles.active : undefined}>Mes rencontres à venir</button>
                <button onClick={() => {setNav(1);setOpen(null)}} className={nav == 1 ? styles.active : undefined}>Mes rencontres passées</button>
            </div>
            {open == null ? (
            <>
                <div className="mTop30">
                    <button className="btn__normal btn__dark">Générer mon badge</button>
                </div>
                <div className="flex gap15 wrap mTop30">
                    <div onClick={() => setOpen(123)} className="w49">
                        <SessionBox 
                            date="21/02/2024"
                            region="Grand Est"
                            title="Énergie, eau et assainissement"
                            link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            register="false"
                        />
                    </div>              
                    <div className="w49">
                        <SessionBox 
                            date="21/02/2024"
                            region="Grand Est"
                            title="Énergie, eau et assainissement"
                            link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            register="false"
                        />
                    </div>
                    <div className="w49">
                        <SessionBox 
                            date="21/02/2024"
                            region="Grand Est"
                            title="Énergie, eau et assainissement"
                            link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            register="false"
                        />
                    </div>              
                    <div className="w49">
                        <SessionBox 
                            date="21/02/2024"
                            region="Grand Est"
                            title="Énergie, eau et assainissement"
                            link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            register="false"
                        />
                    </div>
                    <div className="w49">
                        <SessionBox 
                            date="21/02/2024"
                            region="Grand Est"
                            title="Énergie, eau et assainissement"
                            link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            register="false"
                        />
                    </div>              
                    <div className="w49">
                        <SessionBox 
                            date="21/02/2024"
                            region="Grand Est"
                            title="Énergie, eau et assainissement"
                            link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            register="false"
                        />
                    </div>
                </div>
            </>
            ) : (
                <div className="mTop20">
                    <RencontreDetail id={open} setOpen={setOpen} />
                </div>
            )}
        </div>
    )
}