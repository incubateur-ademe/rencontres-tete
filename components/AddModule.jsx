import { useState, useEffect } from 'react'
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import DynamicQuill from '@/components/DynamicQuill';
import styles from '@/styles/Admin.module.css'
import 'react-quill/dist/quill.snow.css';

export default function AddModule({setOpen}){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [indexToDelete, setIndexToDelete] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [datas, setDatas] = useState({
        nom: '',
        description: '',
        metasModule: {
          resumeProgramme: '',
          objectifs: '',
          duree: '',
          publicCible: '',
          tarif: '',
          programmeModule: []
        }
    });

    const addTranche = () => {
        setDatas(prevDatas => {
            // Copie profonde pour éviter les mutations directes
            const updatedDatas = JSON.parse(JSON.stringify(prevDatas));
    
            // Vérifie si le tableau programmeModule existe, sinon crée un tableau vide
            if (!updatedDatas.metasModule.programmeModule) {
                updatedDatas.metasModule.programmeModule = [];
            }
    
            // Ajoute un nouvel objet tranche avec des valeurs vides ou par défaut
            updatedDatas.metasModule.programmeModule.push({
                horaires: '',
                titre: '',
                description: ''
            });
    
            return updatedDatas;
        });
    };

    const deleteTranche = (indexToDelete) => {
        setDatas(prevDatas => {
            const updatedProgrammeModule = prevDatas.metasModule.programmeModule.filter((_, index) => index !== indexToDelete);
            return {
                ...prevDatas,
                metasModule: {
                    ...prevDatas.metasModule,
                    programmeModule: updatedProgrammeModule
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

    const getDatas = async () => {
        const fetcher = await fetch(`/api/modules/${id}`)
        const json = await fetcher.json()
        setDatas(json[0])
        setEditContent(json[0].metasModule.resumeProgramme)
    }

    const handleChange = (event) => {
        const { name, value, dataset } = event.target;
        const index = dataset.index; // Récupérer l'index pour les éléments du tableau, si défini
    
        setDatas(prevDatas => {
            // Gestion des champs dans le tableau programmeModule
            if (name.startsWith("metasModule.programmeModule") && index !== undefined) {
                const fieldName = name.split(".")[2]; // Obtient 'horaires' de "metasModule.programmeModule.horaires"
    
                // Copie profonde pour éviter la mutation directe (optionnelle mais recommandée)
                const updatedDatas = JSON.parse(JSON.stringify(prevDatas));
    
                // Assurez-vous que programmeModule est initialisé
                if (!updatedDatas.metasModule.programmeModule) {
                    updatedDatas.metasModule.programmeModule = [];
                }
    
                // Mettre à jour l'élément spécifique dans le tableau
                if (updatedDatas.metasModule.programmeModule[index]) {
                    updatedDatas.metasModule.programmeModule[index][fieldName] = value;
                }
    
                return updatedDatas;
            } else if (name.includes('.')) {
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
            const updatedProgrammeModule = [...prevDatas.metasModule.programmeModule];
            [updatedProgrammeModule[index], updatedProgrammeModule[index - 1]] = [updatedProgrammeModule[index - 1], updatedProgrammeModule[index]]; // Échanger les éléments
    
            return {
                ...prevDatas,
                metasModule: {
                    ...prevDatas.metasModule,
                    programmeModule: updatedProgrammeModule,
                },
            };
        });
    };
    
    const moveSectionDown = (index) => {
        if (index === datas.metasModule.programmeModule.length - 1) return; // Ne peut pas déplacer en dessous du dernier élément
    
        setDatas((prevDatas) => {
            const updatedProgrammeModule = [...prevDatas.metasModule.programmeModule];
            [updatedProgrammeModule[index], updatedProgrammeModule[index + 1]] = [updatedProgrammeModule[index + 1], updatedProgrammeModule[index]]; // Échanger les éléments
    
            return {
                ...prevDatas,
                metasModule: {
                    ...prevDatas.metasModule,
                    programmeModule: updatedProgrammeModule,
                },
            };
        });
    };    
    
    async function addModule(moduleData, metasModuleData) {
        const response = await fetch('/api/modules/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moduleData: moduleData,
            metasModuleData: metasModuleData,
          }),
        });
      
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erreur HTTP: ${response.status} - ${errorMessage}`);
        }
      
        return await response.json();
      }
      

    const saveModifs = async () => {

        const moduleData = {
          nom: datas.nom,
          description: datas.description,
          pilier: datas.pilier,
          thematique: datas.thematique
        };

        const metasModuleData = {
          duree: datas.metasModule.duree,
          objectifs: datas.metasModule.objectifs,
          publicCible: datas.metasModule.publicCible,
          resumeProgramme: datas.metasModule.resumeProgramme,
          tarif: datas.metasModule.tarif,
          programmeModule: datas.metasModule.programmeModule
        };

        if(moduleData.nom != '' 
        && moduleData.description != '' 
        && moduleData.pilier != '' 
        && moduleData.thematique != '' 
        && metasModuleData.duree != ''
        && metasModuleData.objectifs != ''
        && metasModuleData.publicCible != ''
        && metasModuleData.tarif != ''
        && metasModuleData.resumeProgramme != ''
        && metasModuleData.programmeModule.length > 0
        ){
            const add = await addModule(moduleData, metasModuleData)
            setNotif({
                text: 'Module ajouté !',
                icon: 'done'
            })
            setOpen(null)
        }
        else{
            setNotif({
                text: 'Des champs obligatoires ne sont pas remplis !',
                icon: 'close'
            })            
        }
    }

    useEffect(() => {
        setDatas(prev => {
            return {
                ...prev,
                metasModule: {
                    ...prev.metasModule,
                    resumeProgramme: editContent
                }
            };
        });
    }, [editContent]);

    return (
        <>
            <div className="mBot30">
                <span onClick={() => setOpen()} className={styles.Back}>Retour aux modules</span>
            </div>
            <div className="flex aligncenter space-between w100 gap40">
                <span className={`${styles.Title} w70`}>Ajouter un nouveau module</span>
                <button onClick={saveModifs} className="btn__normal btn__dark">Enregistrer le module</button>
            </div>
            <div>
                <span className={styles.Subtitle}>Informations principales</span>
                <div className="mTop20">
                    <div className="flex">
                        <input type="text" className="input-text" onChange={handleChange} name="nom" value={datas?.nom} placeholder="Titre du module" />
                    </div>
                    <div className="flex mTop20">
                        <textarea className="textarea" onChange={handleChange} name="description" value={datas?.description} placeholder="Texte d'introduction"></textarea>
                    </div>
                </div>
                <span className={styles.Subtitle}>Résumé et contenu du module</span>
                <div className={`mTop20 ${styles.Quill}`}>
                    <DynamicQuill theme="snow" value={editContent} onChange={setEditContent} />
                </div>
                <span className={styles.Subtitle}>Informations pratiques</span>
                <div className="flex mTop20">
                    <textarea className="textarea" onChange={handleChange} name="metasModule.objectifs" value={datas?.metasModule.objectifs} placeholder="Objectifs du module"></textarea>
                </div>
                <div className="flex gap20 mTop20">
                    <input type="text" onChange={handleChange} name="metasModule.duree" value={datas?.metasModule.duree} className="input-text w33" placeholder="Durée du module" />
                    <input type="text" onChange={handleChange} name="metasModule.publicCible" value={datas?.metasModule.publicCible} className="input-text w33" placeholder="Public cible" />
                    <input type="text" onChange={handleChange} name="metasModule.tarif" value={datas?.metasModule.tarif} className="input-text w33" placeholder="Tarif du module" />
                </div>
                <span className={styles.Subtitle}>Programme du module</span>
                <div>
                    {datas?.metasModule.programmeModule.length > 0 && datas?.metasModule.programmeModule.map((programme, index) => {
                        return (
                            <>
                                <div key={index} className="flex aligncenter gap20">
                                    <div className="w90">
                                        <div className="flex gap20 mTop20">
                                            <input type="text" onChange={handleChange} data-index={index} name="metasModule.programmeModule.horaires" value={programme.horaires} className="input-text w50" placeholder="Horaires" />
                                            <input type="text" onChange={handleChange} data-index={index} name="metasModule.programmeModule.titre" value={programme.titre} className="input-text w50" placeholder="Titre" />
                                        </div>         
                                        <div className="flex mTop20">
                                            <textarea className="textarea" onChange={handleChange} data-index={index} name="metasModule.programmeModule.description" value={programme.description} placeholder="Description"></textarea>
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
                <span className={styles.Subtitle}>Attributs du module</span>
                <div className="flex gap20 mTop20">
                    <div className="select w40">
                        <select onChange={handleChange} name="pilier" value={datas?.pilier} className="input-select">
                            <option value="">Pilier du module</option>
                            <option>Climat Air Energie</option>
                            <option>Economie circulaire</option>
                            <option>Transversal</option>
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>
                    <div className="select w40">
                        <select onChange={handleChange} name="thematique" value={datas?.thematique} className="input-select">
                            <option value="">Thématique du module</option>
                            <option>Planification territoriale</option>
                            <option>Energie, eau et assainissement</option>
                            <option>Mobilité et qualité de l'air</option>
                            <option>Transition bas carbone</option>
                            <option>Prévention et gestion des déchêts</option>
                            <option>Consommation responsable</option>
                            <option>Autres piliers de l'économie circulaire</option>
                            <option>Gouvernance et pilotage</option>
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>
                </div>
                <div className="mTop25">
                    <button onClick={saveModifs} className="btn__normal btn__dark">Enregistrer le module</button>
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