import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import ModulesBack from '@/components/ModulesBack'
import EditModule from '@/components/EditModule'
import EditSession from '@/components/EditSession'
import AddModule from '@/components/AddModule'
import AddSession from '@/components/AddSession'
import SessionsModule from '@/components/SessionsModule'
import styles from '@/styles/Admin.module.css'

export default function Modules(){

    const [open, setOpen] = useState(null)
    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [filter, setFilter] = useState(null)
    const [currentPilier, setCurrentPilier] = useState('')
    const [currentTri, setCurrentTri] = useState('desc')
    const [actions, setActions] = useState(0)

    const deleteModule = async (moduleId) => {
        try {
            const response = await fetch(`/api/modules/delete/?id=${moduleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
    
            const result = await response.json();
            setAlert(null)
            setActions(prev => prev+1)
        } catch (error) {
            console.error('Erreur lors de la suppression du module:', error.message);
        }
        
    }

    const [modules, setModules] = useState([])

    const getModules = async (pilier, tri) => {
        let url = '/api/modules/?';
    
        if (pilier) {
            url += `pilier=${encodeURIComponent(pilier)}&`;
        }
    
        if (tri) {
            url += `tri=${encodeURIComponent(tri)}`;
        }
    
        const fetcher = await fetch(url)
        const json = await fetcher.json()
        setModules(json)
    }

    console.log(modules)
    
    const filterModules = async (event) => {
        const filter = event.target.value;
        setCurrentPilier(filter)

        const tri = currentTri; 
        getModules(filter, tri);
    }
    
    const trierModules = async (event) => {
        const tri = event.target.value;
        setCurrentTri(tri)

        const pilier = currentPilier; 
        getModules(pilier, tri);
    }
    

    useEffect(() => {
        getModules(currentPilier, currentTri)
    }, [open, actions])


    return (
        <>
            {open == null ? (
                <>
                    <div className="flex aligncenter space-between w100 gap40">
                        <span className={`${styles.Title} w65`}>Tous les modules</span>
                        <button onClick={() => setOpen({ type: 'add', model: 'module' })} className="btn__normal btn__dark">Ajouter un nouveau module</button>
                    </div>
                    <div className="flex gap20 mTop30">
                        <div className="select w50">
                            <select onChange={filterModules} className="input-select">
                                <option value="">Filtrer par pilier</option>
                                <option>Climat Air Energie</option>
                                <option>Economie circulaire</option>
                                <option>Transversal</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                        <div className="select w50">
                            <select onChange={trierModules} className="input-select">
                                <option value="desc">Trier par dernière date de publication</option>
                                <option value="asc">Trier par première date de publication</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                    </div>
                    <div className="mTop30">
                        {modules.length > 0 ? (
                            modules.map((module, index) => {
                                return (
                                    <div key={index} className="w100 mBot10">
                                        <ModulesBack 
                                            date={module.datePublication}
                                            lastUpdate={module.lastUpdate}
                                            category={module.pilier}
                                            title={module.nom}
                                            id={module.id}
                                            setOpen={setOpen}
                                            setAlert={setAlert}
                                            action={() => deleteModule(module.id)}
                                        />
                                    </div>                                     
                                )
                            })
                        ) : (
                            <>
                                <span>Il n'y a aucun module pour le moment.</span>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <>  
                    {open.type == 'edit' && (
                        <>
                            {open.model == 'module' ? (
                                <EditModule setOpen={setOpen} id={open.id} />
                            ) : (
                                <EditSession setOpen={setOpen} id={open.id} nom={open.nom} moduleId={open.moduleId} />
                            )}
                            
                        </>
                    )}
                    {open.type == 'add' && (
                        <>
                            {open.model == 'module' ? (
                                <AddModule setOpen={setOpen} id={open.id} />
                            ) : (
                                <AddSession setOpen={setOpen} id={open.id} nom={open.nom} />
                            )}  
                            
                        </>
                    )}
                    {open.type == 'sessions' && (
                        <>  
                            <div className="mBot30">
                                <span onClick={() => setOpen(null)} className={styles.Back}>Retour aux modules</span>
                            </div>
                            <SessionsModule setOpen={setOpen} id={open.id} nom={open.nom} />
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