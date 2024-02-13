import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import SessionsBack from '@/components/SessionsBack'
import EditModule from '@/components/EditModule'
import AddModule from '@/components/AddModule'
import styles from '@/styles/Admin.module.css'

export default function SessionsModule({ id, setOpen, open }){

    const [nav, setNav] = useState(0)
    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)

    const deleteModule = () => {
        console.log('deleted')
        setAlert(null)
    }

    return (
        <>
            {open == null ? (
                <>
                    <div className="flex aligncenter space-between w100 gap40 mBot15">
                        <span className={`${styles.Title} w65`}>Toutes les sessions pour le module :<br />Énergie, eau et assainissement</span>
                        <button onClick={() => setOpen({ type: 'add' })} className="btn__normal btn__dark">Ajouter une session</button>
                    </div>
                    <div className={styles.Menu}>
                        <button onClick={() => {setNav(0)}} className={nav == 0 ? styles.active : undefined}>Sessions programmées</button>
                        <button onClick={() => {setNav(1)}} className={nav == 1 ? styles.active : undefined}>Sessions passées</button>
                    </div>
                    <div className="mTop30">
                        <div className="w100 mBot10">
                            <SessionsBack 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                        <div className="w100 mBot10">
                            <SessionsBack 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                        <div className="w100 mBot10">
                            <SessionsBack 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                        <div className="w100 mBot10">
                            <SessionsBack 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                    </div>
                </>
            ) : (
                <>  
                    {open.type == 'edit' && (
                        <>  
                            <EditModule setOpen={setOpen} />
                        </>
                    )}
                    {open.type == 'add' && (
                        <>  
                            <AddModule setOpen={setOpen} />
                        </>
                    )}
                    {open.type == 'sessions' && (
                        <>  
                            Toutes les sessions
                        </>
                    )}
                </>
            )}
            {alert != null && (
                <Alert datas={alert} setAlert={setAlert} />
            )}  
        </>
    )
}