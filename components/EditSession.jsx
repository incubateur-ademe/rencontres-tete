import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import DynamicQuill from '@/components/DynamicQuill';
import styles from '@/styles/Admin.module.css'
import 'react-quill/dist/quill.snow.css';

export default function AddSession({setOpen, id}){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [editContent, setEditContent] = useState('');

    const deleteTranche = () => {
        console.log('deleted')
        setAlert(null)
    }

    const saveModifs = () => {
        setNotif({
            text: 'Modifications enregistrées'
        })
    }

    return (
        <>
            <div className="mBot30">
                <span onClick={() => setOpen({ id:id, type:'sessions', model:'session' })} className={styles.Back}>Retour aux sessions</span>
            </div>
            <div className="flex aligncenter space-between w100">
                <span className={`${styles.Title} w60`}>Modifier cette session pour le module :<br />Énergie, eau et assainissement</span>
                <button onClick={saveModifs} className="btn__normal btn__dark w23">Enregistrer la session</button>
                <button onClick={saveModifs} className="btn__normal btn__dark w15">Publier</button>
            </div>
            <div>
                <span className={styles.Subtitle}>Informations principales</span>
                <div className="mTop20">
                    <div className="flex gap20">
                        <div className="select w50">
                            <select className="input-select">
                                <option>Région</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                        <div className="select w50">
                            <select className="input-select">
                                <option>Département</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                    </div>
                </div>
                <span className={styles.Subtitle}>Détails pratiques de la rencontre</span>
                <div className="flex gap20 mTop20">
                    <div className="w50">
                        <div className="flex aligncenter gap5 w50">
                            <div className="w10">
                                <img src="/medias/icon-date.png" alt="icon" className="w80" />
                            </div>
                            <div className="w80">
                                <span className={styles.dLabel}>Date et horaires :</span>
                            </div>
                        </div>
                        <input type="text" className="input-text mTop10" placeholder="Date et horaires" />
                    </div>
                    <div className="w50">
                        <div className="flex aligncenter gap5 w50">
                            <div className="w10">
                                <img src="/medias/icon-lieu.png" alt="icon" className="w80" />
                            </div>
                            <div className="w80">
                                <span className={styles.dLabel}>Lieu de la rencontre :</span>
                            </div>
                        </div>
                        <input type="text" className="input-text mTop10" placeholder="Adresse complète" />
                    </div>
                </div>
                <div className="flex gap20 mTop20">
                    <div className="w50">
                        <div className="flex aligncenter gap5 w50">
                            <div className="w10">
                                <img src="/medias/icon-places.png" alt="icon" className="w80" />
                            </div>
                            <div className="w80">
                                <span className={styles.dLabel}>Nombre de places :</span>
                            </div>
                        </div>
                        <input type="text" className="input-text mTop10" placeholder="10, 20, 30, ..." />
                    </div>
                    <div className="w50">
                        <div className="flex aligncenter gap5 w50">
                            <div className="w10">
                                <img src="/medias/icon-transport.png" alt="icon" className="w80" />
                            </div>
                            <div className="w80">
                                <span className={styles.dLabel}>Pour venir :</span>
                            </div>
                        </div>
                        <input type="text" className="input-text mTop10" placeholder="Transport, etc..." />
                    </div>
                </div>
                <div className="w100 mTop20">
                        <div className="flex aligncenter gap5 w50">
                            <div className="w5">
                                <img src="/medias/icon-date.png" alt="icon" className="w80" />
                            </div>
                            <div className="w95">
                                <span className={styles.dLabel}>Date limite d'inscription :</span>
                            </div>
                        </div>
                        <input type="text" className="input-text mTop10" placeholder="Date et horaires" />
                    </div>
                <div>
                <div className="w100 mTop20">
                    <div className="flex aligncenter gap5 w50">
                        <div className="w5">
                            <img src="/medias/icon-infos.png" alt="icon" className="w80" />
                        </div>
                        <div className="w95">
                            <span className={styles.dLabel}>Infos complémentaires :</span>
                        </div>
                    </div>
                    <textarea className="textarea mTop10" placeholder="Informations additionnelles..."></textarea>
                </div>
                </div>

                <span className={styles.Subtitle}>Intervenants pour ce module</span>
                <div>
                    <div className="flex aligncenter gap20">
                        <div className="w90">
                            <div className="flex gap20 mTop20">
                                <input type="text" className="input-text w50" placeholder="Nom / Prénom" />
                                <input type="text" className="input-text w50" placeholder="Fonction" />
                                <input type="text" className="input-text w50" placeholder="Structure" />
                            </div>         
                            <div className="flex mTop20">
                                <input type="mail" className="input-text w100" placeholder="Adresse e-mail de l'intervenant" />
                            </div>  
                        </div>
                        <div className="w10 flex aligncenter flex-end gap5">
                            <span
                                className={`material-icons ${styles.DeleteT}`}
                                onClick={() => setAlert({
                                    icon: 'warning',
                                    text: 'Êtes-vous sûr de vouloir supprimer cet intervenant ?',
                                    action: deleteTranche
                                })}
                            >
                                delete
                            </span>
                            <span className={`material-icons ${styles.NavT}`}>expand_less</span>
                            <span className={`material-icons ${styles.NavT}`}>expand_more</span>
                        </div>
                    </div>
                    <button className={`mTop20 ${styles.AddTranche}`}>
                        <span className="material-icons">add</span>
                        Ajouter un intervenant
                    </button>
                </div>

                <span className={styles.Subtitle}>Programme du module</span>
                <div>
                    <div className="flex aligncenter gap20">
                        <div className="w90">
                            <div className="flex gap20 mTop20">
                                <input type="text" className="input-text w50" placeholder="Horaires" />
                                <input type="text" className="input-text w50" placeholder="Titre" />
                            </div>         
                            <div className="flex mTop20">
                                <textarea className="textarea" placeholder="Description"></textarea>
                            </div>  
                        </div>
                        <div className="w10 flex aligncenter flex-end gap5">
                            <span
                                className={`material-icons ${styles.DeleteT}`}
                                onClick={() => setAlert({
                                    icon: 'warning',
                                    text: 'Êtes-vous sûr de vouloir supprimer cette section ?',
                                    action: deleteTranche
                                })}
                            >
                                delete
                            </span>
                            <span className={`material-icons ${styles.NavT}`}>expand_less</span>
                            <span className={`material-icons ${styles.NavT}`}>expand_more</span>
                        </div>
                    </div>
                    <button className={`mTop20 ${styles.AddTranche}`}>
                        <span className="material-icons">add</span>
                        Ajouter une tranche horaire
                    </button>
                </div>

                <span className={styles.Subtitle}>Documents spécifiques à cette rencontre</span>
                <div>
                    <div className="flex wrap gap20 mTop20">
                        <button className="link w48 text-left">+ Ajouter un document</button>
                    </div>
                </div>
                <div className="mTop25">
                    <button onClick={saveModifs} className="btn__normal btn__dark">Enregistrer la session</button>
                </div>
            </div>
            {alert != null && (
                <Alert datas={alert} setAlert={setAlert} />
            )}  
            {notif != null && (
                <Notif datas={notif} setNotif={setNotif} />
            )}
        </>
    )
}