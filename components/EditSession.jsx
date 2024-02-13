import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import DynamicQuill from '@/components/DynamicQuill';
import styles from '@/styles/Admin.module.css'
import 'react-quill/dist/quill.snow.css';

export default function EditSession({setOpen, id, nom}){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [indexToDelete, setIndexToDelete] = useState(null);
    const [indexToDeleteI, setIndexToDeleteI] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [datas, setDatas] = useState({
        moduleId: id,
        departement: '',
        region: '',
        status: '',
        metasSession: {
          dateHoraires: '',
          lieuRencontre: '',
          nombrePlaces: '',
          infosTransport: '',
          dateLimiteInscription: '',
          infosComplementaires: '',
          intervenants: [],
          programmeSession: [],
          urlsPDF: []
        }
    });

    const addTranche = () => {
        setDatas(prevDatas => {
            // Copie profonde pour éviter les mutations directes
            const updatedDatas = JSON.parse(JSON.stringify(prevDatas));
    
            // Vérifie si le tableau programmeModule existe, sinon crée un tableau vide
            if (!updatedDatas.metasSession.programmeSession) {
                updatedDatas.metasSession.programmeSession = [];
            }
    
            // Ajoute un nouvel objet tranche avec des valeurs vides ou par défaut
            updatedDatas.metasSession.programmeSession.push({
                horaires: '',
                titre: '',
                description: ''
            });
    
            return updatedDatas;
        });
    };

    const addIntervenant = () => {
        setDatas(prevDatas => {
            // Copie profonde pour éviter les mutations directes
            const updatedDatas = JSON.parse(JSON.stringify(prevDatas));
    
            // Vérifie si le tableau programmeModule existe, sinon crée un tableau vide
            if (!updatedDatas.metasSession.intervenants) {
                updatedDatas.metasSession.intervenants = [];
            }
    
            // Ajoute un nouvel objet tranche avec des valeurs vides ou par défaut
            updatedDatas.metasSession.intervenants.push({
                nom: '',
                fonction: '',
                structure: '',
                email: ''
            });
    
            return updatedDatas;
        });
    };

    const deleteTranche = (indexToDelete) => {
        setDatas(prevDatas => {
            const updatedProgrammeSession = prevDatas.metasSession.programmeSession.filter((_, index) => index !== indexToDelete);
            return {
                ...prevDatas,
                metasSession: {
                    ...prevDatas.metasSession,
                    programmeSession: updatedProgrammeSession
                }
            };
        });
        setAlert(null)
    };    

    const deleteIntervenant = (indexToDeleteI) => {
        setDatas(prevDatas => {
            const updateIntervenantsSession = prevDatas.metasSession.intervenants.filter((_, index) => index !== indexToDeleteI);
            return {
                ...prevDatas,
                metasSession: {
                    ...prevDatas.metasSession,
                    intervenants: updateIntervenantsSession
                }
            };
        });
        setAlert(null)
    };    

    const requestDeleteTranche = (index) => {
        setIndexToDelete(index);
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sûr de vouloir supprimer cette section ?',
            // Supposons que `action` sera appelé si l'utilisateur confirme
            action: () => deleteTranche(index)
        });
    };

    const requestDeleteIntervenant = (index) => {
        setIndexToDeleteI(index);
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sûr de vouloir supprimer cet intervenant ?',
            // Supposons que `action` sera appelé si l'utilisateur confirme
            action: () => deleteIntervenant(index)
        });
    };

    const getDatas = async () => {
        const fetcher = await fetch(`/api/sessions/${id}`)
        const json = await fetcher.json()
        setDatas(json[0])
    }

    const handleChange = (event) => {
        const { name, value, dataset } = event.target;
        const index = dataset.index; // Récupérer l'index pour les éléments du tableau, si défini
    
        setDatas(prevDatas => {
            // Gestion des champs dans le tableau programmeModule
            if (name.startsWith("metasSession.programmeSession") && index !== undefined) {
                const fieldName = name.split(".")[2]; // Obtient 'horaires' de "metasSession.programmeSession.horaires"
    
                // Copie profonde pour éviter la mutation directe (optionnelle mais recommandée)
                const updatedDatas = JSON.parse(JSON.stringify(prevDatas));
    
                // Assurez-vous que programmeSession est initialisé
                if (!updatedDatas.metasSession.programmeSession) {
                    updatedDatas.metasSession.programmeSession = [];
                }
    
                // Mettre à jour l'élément spécifique dans le tableau
                if (updatedDatas.metasSession.programmeSession[index]) {
                    updatedDatas.metasSession.programmeSession[index][fieldName] = value;
                }
    
                return updatedDatas;
            }
            else if (name.startsWith("metasSession.intervenants") && index !== undefined) {
                const fieldName = name.split(".")[2]; // Obtient 'horaires' de "metasSession.programmeSession.horaires"
    
                // Copie profonde pour éviter la mutation directe (optionnelle mais recommandée)
                const updatedDatas = JSON.parse(JSON.stringify(prevDatas));
    
                // Assurez-vous que programmeSession est initialisé
                if (!updatedDatas.metasSession.intervenants) {
                    updatedDatas.metasSession.intervenants = [];
                }
    
                // Mettre à jour l'élément spécifique dans le tableau
                if (updatedDatas.metasSession.intervenants[index]) {
                    updatedDatas.metasSession.intervenants[index][fieldName] = value;
                }
    
                return updatedDatas;
            }
            else if (name.includes('.')) {
                // Gestion des champs imbriqués mais pas dans un tableau
                const [parent, key] = name.split('.');
                return {
                    ...prevDatas,
                    [parent]: {
                        ...prevDatas[parent],
                        [key]: value
                    }
                };
            } else {
                // Gérer les champs de niveau supérieur
                return {
                    ...prevDatas,
                    [name]: value
                };
            }
        });
    };

    const moveSectionUp = (index) => {
        if (index === 0) return; // Ne peut pas déplacer plus haut que le premier élément
    
        setDatas((prevDatas) => {
            const updatedProgrammeSession = [...prevDatas.metasSession.programmeSession];
            [updatedProgrammeSession[index], updatedProgrammeSession[index - 1]] = [updatedProgrammeSession[index - 1], updatedProgrammeSession[index]]; // Échanger les éléments
    
            return {
                ...prevDatas,
                metasSession: {
                    ...prevDatas.metasSession,
                    programmeSession: updatedProgrammeSession,
                },
            };
        });
    };

    const moveSectionUpI = (index) => {
        if (index === 0) return; // Ne peut pas déplacer plus haut que le premier élément
    
        setDatas((prevDatas) => {
            const updatedIntervenantsSession = [...prevDatas.metasSession.intervenants];
            [updatedIntervenantsSession[index], updatedIntervenantsSession[index - 1]] = [updatedIntervenantsSession[index - 1], updatedIntervenantsSession[index]]; // Échanger les éléments
    
            return {
                ...prevDatas,
                metasSession: {
                    ...prevDatas.metasSession,
                    intervenants: updatedIntervenantsSession,
                },
            };
        });
    };
    
    const moveSectionDown = (index) => {
        if (index === datas.metasSession.programmeSession.length - 1) return; // Ne peut pas déplacer en dessous du dernier élément
    
        setDatas((prevDatas) => {
            const updatedProgrammeSession = [...prevDatas.metasSession.programmeSession];
            [updatedProgrammeSession[index], updatedProgrammeSession[index + 1]] = [updatedProgrammeSession[index + 1], updatedProgrammeSession[index]]; // Échanger les éléments
    
            return {
                ...prevDatas,
                metasSession: {
                    ...prevDatas.metasSession,
                    programmeSession: updatedProgrammeSession,
                },
            };
        });
    };  
    
    const moveSectionDownI = (index) => {
        if (index === datas.metasSession.intervenants.length - 1) return; // Ne peut pas déplacer en dessous du dernier élément
    
        setDatas((prevDatas) => {
            const updateIntervenantsSession = [...prevDatas.metasSession.intervenants];
            [updateIntervenantsSession[index], updateIntervenantsSession[index + 1]] = [updateIntervenantsSession[index + 1], updateIntervenantsSession[index]]; // Échanger les éléments
    
            return {
                ...prevDatas,
                metasSession: {
                    ...prevDatas.metasSession,
                    intervenants: updateIntervenantsSession,
                },
            };
        });
    };  

    async function updateSession(sessionData, metasSessionData, sessionId) {
        console.log(sessionData)

        const response = await fetch('/api/sessions/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionData: sessionData,
            metasSessionData: metasSessionData,
            sessionId: sessionId
          }),
        });
      
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erreur HTTP: ${response.status} - ${errorMessage}`);
        }
      
        return await response.json();
      }

      const saveModifs = async () => {

        const sessionData = {
          departement: datas.departement,
          region: datas.region,
          status: datas.status
        };

        const metasSessionData = {
            dateHoraires: datas.metasSession.dateHoraires,
            lieuRencontre: datas.metasSession.lieuRencontre,
            nombrePlaces: datas.metasSession.nombrePlaces,
            infosTransport: datas.metasSession.infosTransport,
            dateLimiteInscription: datas.metasSession.dateLimiteInscription,
            infosComplementaires: datas.metasSession.infosComplementaires,
            intervenants: datas.metasSession.intervenants,
            programmeSession: datas.metasSession.programmeSession,
            urlsPDF: datas.metasSession.urlsPDF
        }

        if(sessionData.moduleId != '' 
        && sessionData.departement != '' 
        && sessionData.region != '' 
        && metasSessionData.dateHoraires != ''
        && metasSessionData.lieuRencontre != ''
        && metasSessionData.nombrePlaces != ''
        && metasSessionData.infosTransport != ''
        && metasSessionData.intervenants.length >= 0
        && metasSessionData.programmeSession.length >= 0
        ){
            const update = await updateSession(sessionData, metasSessionData, id)
            setNotif({
                text: 'Session mise à jour !',
                icon: 'done'
            })
            // setOpen({ type: 'sessions', id: id, nom: nom })
        }
        else{
            setNotif({
                text: 'Des champs obligatoires ne sont pas remplis !',
                icon: 'close'
            })            
        }
    }

    useEffect(() => {
        getDatas()
    }, [])

    return (
        <>
            <div className="mBot30">
                <span onClick={() => setOpen({ id:id, type:'sessions', nom: nom })} className={styles.Back}>Retour aux sessions</span>
            </div>
            <div className="flex aligncenter space-between w100">
                <span className={`${styles.Title} w70`}>Modifier la session pour le module :<br /> {nom}</span>
                <button onClick={saveModifs} className="btn__normal btn__dark w23">Enregistrer la session</button>
            </div>
            <div>
                <span className={styles.Subtitle}>Informations principales</span>
                <div className="mTop20">
                    <div className="flex gap20">
                        <div className="select w50">
                            <select onChange={handleChange} name="region" value={datas?.region} className="input-select">
                                <option>Région</option>
                                <option>Grand-Est</option>
                            </select>
                            <span className="material-icons">expand_more</span>
                        </div>
                        <div className="select w50">
                            <select onChange={handleChange} name="departement" value={datas?.departement} className="input-select">
                                <option>Département</option>
                                <option>68 - Haut-Rhin</option>
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
                                <span className={styles.dLabel}>Date de la session :</span>
                            </div>
                        </div>
                        <input type="date" onChange={handleChange} name="metasSession.dateHoraires" value={datas?.metasSession.dateHoraires} className="input-text mTop10" placeholder="Date de la session" />
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
                        <input type="text" onChange={handleChange} name="metasSession.lieuRencontre" value={datas?.metasSession.lieuRencontre} className="input-text mTop10" placeholder="Adresse complète" />
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
                        <input type="text" onChange={handleChange} name="metasSession.nombrePlaces" value={datas?.metasSession.nombrePlaces} className="input-text mTop10" placeholder="10, 20, 30, ..." />
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
                        <input type="text" onChange={handleChange} name="metasSession.infosTransport" value={datas?.metasSession.infosTransport} className="input-text mTop10" placeholder="Transport, etc..." />
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
                        <input type="date" onChange={handleChange} name="metasSession.dateLimiteInscription" value={datas?.metasSession.dateLimiteInscription} className="input-text mTop10" placeholder="Date et horaires" />
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
                    <textarea className="textarea mTop10" onChange={handleChange} name="metasSession.infosComplementaires" value={datas?.metasSession.infosComplementaires} placeholder="Informations additionnelles..."></textarea>
                </div>
                </div>

                <span className={styles.Subtitle}>Intervenants pour ce module</span>
                <div>
                {datas?.metasSession.intervenants.length > 0 && datas?.metasSession.intervenants.map((intervenant, index) => {
                        return (
                            <>
                                <div key={index} className="flex aligncenter gap20">
                                    <div className="w90">
                                        <div className="flex gap20 mTop20">
                                            <input type="text" onChange={handleChange} data-index={index} name="metasSession.intervenants.nom" value={intervenant.nom} className="input-text w50" placeholder="Nom / Prénom" />
                                            <input type="text" onChange={handleChange} data-index={index} name="metasSession.intervenants.fonction" value={intervenant.fonction} className="input-text w50" placeholder="Fonction" />
                                            <input type="text" onChange={handleChange} data-index={index} name="metasSession.intervenants.structure" value={intervenant.structure} className="input-text w50" placeholder="Structure" />
                                        </div>         
                                        <div className="flex mTop20 w100">
                                            <input type="mail" onChange={handleChange} data-index={index} name="metasSession.intervenants.email" value={intervenant.email} className="input-text" placeholder="Adresse e-mail de l'intervenant" />
                                        </div>  
                                    </div>
                                    <div className="w10 flex aligncenter flex-end gap5">
                                        <span
                                            className={`material-icons ${styles.DeleteT}`}
                                            onClick={() => requestDeleteIntervenant(index)}
                                        >
                                            delete
                                        </span>
                                        <span onClick={() => moveSectionUpI(index)} className={`material-icons ${styles.NavT}`}>expand_less</span>
                                        <span onClick={() => moveSectionDownI(index)} className={`material-icons ${styles.NavT}`}>expand_more</span>
                                    </div>
                                </div>                            
                            </>
                        )
                    })}
                    <button onClick={addIntervenant} className={`mTop20 ${styles.AddTranche}`}>
                        <span className="material-icons">add</span>
                        Ajouter un intervenant
                    </button>
                </div>

                <span className={styles.Subtitle}>Programme de la session</span>
                <div>
                    {datas?.metasSession.programmeSession.length > 0 && datas?.metasSession.programmeSession.map((programme, index) => {
                        return (
                            <>
                                <div key={index} className="flex aligncenter gap20">
                                    <div className="w90">
                                        <div className="flex gap20 mTop20">
                                            <input type="text" onChange={handleChange} data-index={index} name="metasSession.programmeSession.horaires" value={programme.horaires} className="input-text w50" placeholder="Horaires" />
                                            <input type="text" onChange={handleChange} data-index={index} name="metasSession.programmeSession.titre" value={programme.titre} className="input-text w50" placeholder="Titre" />
                                        </div>         
                                        <div className="flex mTop20">
                                            <textarea className="textarea" onChange={handleChange} data-index={index} name="metasSession.programmeSession.description" value={programme.description} placeholder="Description"></textarea>
                                        </div>  
                                    </div>
                                    <div className="w10 flex aligncenter flex-end gap5">
                                        <span
                                            className={`material-icons ${styles.DeleteT}`}
                                            onClick={() => requestDeleteTranche(index)}
                                        >
                                            delete
                                        </span>
                                        <span onClick={() => moveSectionUp(index)} className={`material-icons ${styles.NavT}`}>expand_less</span>
                                        <span onClick={() => moveSectionDown(index)} className={`material-icons ${styles.NavT}`}>expand_more</span>
                                    </div>
                                </div>                            
                            </>
                        )
                    })}
                    <button onClick={addTranche} className={`mTop20 ${styles.AddTranche}`}>
                        <span className="material-icons">add</span>
                        Ajouter une tranche horaire
                    </button>
                </div>

                <span className={styles.Subtitle}>Documents spécifiques à cette rencontre</span>
                <div>
                    <div className="flex wrap gap20 mTop20">
                        <div className="w48 text-left">
                            <input type="file" id="doc" className="input-file" />
                            <label for="doc">
                                + Ajouter un document
                            </label>
                        </div>
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