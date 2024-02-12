import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import ModulesBack from '@/components/ModulesBack'
import EditModule from '@/components/EditModule'
import AddModule from '@/components/AddModule'
import styles from '@/styles/Admin.module.css'

export default function Modules(){

    const [open, setOpen] = useState(null)
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
                    <div className="flex aligncenter space-between w100 gap40">
                        <span className={`${styles.Title} w65`}>Tous les modules publiés</span>
                        <button onClick={() => setOpen({ type: 'add' })} className="btn__normal btn__dark">Ajouter un nouveau module</button>
                    </div>
                    <div className="flex gap20 mTop30">
                        <div className="select w50">
                            <select className="input-select">
                                <option>Filtrer par pilier</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                        <div className="select w50">
                            <select className="input-select">
                                <option>Trier par date de publication</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                    </div>
                    <div className="mTop30">
                        <div className="w100 mBot10">
                            <ModulesBack 
                                date="21/02/2024"
                                category="Climat Air Énergie"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                        <div className="w100 mBot10">
                            <ModulesBack 
                                date="21/02/2024"
                                category="Climat Air Énergie"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                        <div className="w100 mBot10">
                            <ModulesBack 
                                date="21/02/2024"
                                category="Climat Air Énergie"
                                title="Énergie, eau et assainissement"
                                id="123"
                                setOpen={setOpen}
                                setAlert={setAlert}
                                action={deleteModule}
                            />
                        </div>  
                        <div className="w100 mBot10">
                            <ModulesBack 
                                date="21/02/2024"
                                category="Climat Air Énergie"
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