import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import DynamicQuill from '@/components/DynamicQuill';
import styles from '@/styles/Admin.module.css'
import 'react-quill/dist/quill.snow.css';

export default function EditModule({setOpen}){

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
                <span onClick={() => setOpen()} className={styles.Back}>Retour aux modules</span>
            </div>
            <div className="flex aligncenter space-between w100 gap40">
                <span className={`${styles.Title} w70`}>Modifier le module</span>
                <button onClick={saveModifs} className="btn__normal btn__dark">Enregistrer le module</button>
            </div>
            <div>
                <span className={styles.Subtitle}>Informations principales</span>
                <div className="mTop20">
                    <div className="flex">
                        <input type="text" className="input-text" placeholder="Titre du module" />
                    </div>
                    <div className="flex mTop20">
                        <textarea className="textarea" placeholder="Texte d'introduction"></textarea>
                    </div>
                </div>
                <span className={styles.Subtitle}>Résumé et contenu du module</span>
                <div className={`mTop20 ${styles.Quill}`}>
                    <DynamicQuill theme="snow" value={editContent} onChange={setEditContent} />
                </div>
                <span className={styles.Subtitle}>Informations pratiques</span>
                <div className="flex mTop20">
                    <textarea className="textarea" placeholder="Objectifs du module"></textarea>
                </div>
                <div className="flex gap20 mTop20">
                    <input type="text" className="input-text w33" placeholder="Durée du module" />
                    <input type="text" className="input-text w33" placeholder="Public cible" />
                    <input type="text" className="input-text w33" placeholder="Tarif du module" />
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
                <span className={styles.Subtitle}>Attributs du module</span>
                <div className="flex gap20 mTop20">
                    <div className="select w40">
                        <select className="input-select">
                            <option>Pilier du module</option>
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>
                    <div className="select w40">
                        <select className="input-select">
                            <option>Thématique du module</option>
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>
                </div>
                <div className="mTop25">
                    <button className="btn__normal btn__dark">Enregistrer le module</button>
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