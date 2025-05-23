import { useState, useEffect } from 'react'
import Participant from '@/components/Participant'
import * as XLSX from 'xlsx';
import * as JSZip from 'jszip'; // Importer JSZip
import { saveAs } from 'file-saver'; // Importer file-saver pour gérer le téléchargement
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import styles from '@/styles/Participants.module.css'
import DynamicQuill from '@/components/DynamicQuill';
import 'react-quill/dist/quill.snow.css';

export default function Participants({ session, setOpen }){

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [number, setNumber] = useState(0)
    const [users, setUsers] = useState([])
    const [actions, setActions] = useState(0)
    const [fonctions, setFonctions] = useState([])
    const [selectedFonction, setSelectedFonction] = useState('') 
    const [editContent, setEditContent] = useState('');
    const [subject, setSubject] = useState('')
    const [isMail, setIsMail] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)
    const [openList, setOpenList] = useState(false)
    const [searchUsers, setSearchUsers] = useState([])
    const [userAdded, setUserAdded] = useState(null)
    const [loading, setLoading] = useState(false);
    const [filterPresence, setFilterPresence] = useState('all');
    const [filterRegion, setFilterRegion] = useState('all'); // 'all' | 'hors'
    const [filterRole, setFilterRole] = useState('all'); // 'all' | 'intervenants'



    const flattenJson = (jsonArray) => {
        return jsonArray.map(item => {
          const flattenedItem = { ...item };
          
          if (item.user) {
            flattenedItem.userOrganisation = item.user.organisation || '';
            flattenedItem.userFonction = item.user.fonction || '';
            delete flattenedItem.user;
          }

      
          return flattenedItem;
        });
      };
      
      const exportToExcel = (jsonArray, sheetName) => {

        const flattenedData = flattenJson(jsonArray);
      
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.setAttribute('download', `${sheetName}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
      };
      

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

      // Fonction pour télécharger tous les badges
    const downloadAllBadges = async () => {
        setLoading(true);
        const zip = new JSZip();
        
        console.log("all users => ", users)

        for (const participant of users) {

        if (participant.deleted === true) continue;

        const datas = {
            nom: participant.nom,
            prenom: participant.prenom,
            program: participant.session.metasSession.programmeSession,
            organisation: participant.structure || '',
        };

        const response = await fetch('/api/generate-badge', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas),
        });

        const blob = await response.blob();
        zip.file(`badge_${participant.nom}_${participant.prenom}.pdf`, blob);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'badges_participants.zip');
        setLoading(false);
        }).catch(error => {
        console.error('Erreur lors de la génération du fichier ZIP:', error);
        setLoading(false);
        });
    };

    const getParticipants = async () => {
        const fetcher = await fetch(`/api/registrations/bySession?sessionId=${session.id}`)
        const json = await fetcher.json()
        if(json.length > 0){
            setNumber(json.length)
            setUsers(json)
            updateFonctions(json)
            setStats(computeStats(json, session))
          }          
    }

    const updateFonctions = (participants) => {
        let fonctionCounts = {};
        participants.forEach(participant => {
            fonctionCounts[participant.fonction] = (fonctionCounts[participant.fonction] || 0) + 1;
        });
        const fonctionArray = Object.keys(fonctionCounts).map(fonction => ({
            fonction: fonction,
            count: fonctionCounts[fonction]
        }));
        setFonctions(fonctionArray);
    }

    const sendMail = async () => {
        console.log('envoi email')
        // fonction pour envoyer le mail uniquement aux NON ANNULÉS
        const sendMail = await fetch(`/api/emails/toParticipants`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                sujet: subject,
                content: editContent,
                sessionId: session.id
            })
        })
        
        setAlert(null)
        setNotif({
            text: 'Le mail a bien été envoyé !',
            icon: 'done'
        })
    }

    const preMail = () => {
        if(subject != '' && editContent != ''){
            // Envoyer le mail
            setAlert({
                icon: 'warning',
                text: 'Êtes-vous sûr de vouloir envoyer cet e-mail ?',
                action: () => sendMail()
            });
        }
        else{
            setNotif({
                text: 'Tous les champs ne sont pas remplis !',
                icon: 'done'
            })
        }
    }

    const chercherInscrit = async (nom) => {
        if(nom.length >= 3){
            const getUsers = await fetch(`/api/users/findUser?search=${nom}`)
            const get = await getUsers.json()
            setSearchUsers(get)
            setOpenList(true)
        }
        else{
            setOpenList(false)
        }
    }

    const addUserFromList = async (user) => {
        setUserAdded(user)
        setOpenList(false)
        setSearchUsers([])
    }

    const ajouterInscrit = async () => {
        if (!userAdded) return;
    
        const isAccount = !!userAdded.email; // S'il a un "email" → c'est un account (DR/Admin)
    
        let inscriptionData = {
            civilite: '-',
            mail: isAccount ? userAdded.email : userAdded.mail,
            nom: userAdded.nom,
            prenom: userAdded.prenom,
            structure: userAdded.organisation,
            fonction: userAdded.fonction,
            typeFonction: '-',
            ville: '-',
            region: userAdded.region,
            telephone: '-',
            transport: '-',
            repas: false,
            repas2: false,
            besoins: null,
            regime: 'Omnivore',
            programmeTETE: null,
            participationUlterieure: null,
            days: false
        };
    
        const registering = await fetch('/api/registrations/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inscriptionData: inscriptionData,
                userId: userAdded.id,
                sessionId: session.id,
                type: isAccount ? 'special' : 'user'
            })
        });
    
        const json = await registering.json();
    
        setUserAdded(null)
        setOpenList(false)
        setSearchUsers([])
    
        setAlert(null)
        setNotif({
            text: 'Le nouveau participant a été ajouté !',
            icon: 'done'
        });
    
        getParticipants();
    };
    

    const computeStats = (participants, session) => {
        const maxPlaces = session.metasSession.nombrePlaces || 0;
        const totalParticipants = participants.filter(p => !p.deleted).length;
        const intervenants = participants.filter(p => p.role === 'intervenant' && !p.deleted).length;
        const horsRegion = participants.filter(p => p.region !== session.region && !p.deleted).length;
      
        return {
          maxPlaces,
          totalParticipants,
          intervenants,
          horsRegion,
        };
      };

      const [stats, setStats] = useState({
        maxPlaces: 0,
        totalParticipants: 0,
        intervenants: 0,
        horsRegion: 0
      });
      

    useEffect(() => {
        getParticipants()
    }, [actions])

    return (
        <>
            <div className={styles.Participants}>
                <span onClick={() => setOpen(null)} className={styles.Back}>Retour aux sessions</span>
                <div className="mTop20 flex gap20">
                    <div className="card w25">
                        <strong>Places max ouvertes</strong>
                        <div>{stats.maxPlaces}</div>
                    </div>
                    <div className="card w25">
                        <strong>Participants inscrits</strong>
                        <div>{stats.totalParticipants}</div>
                    </div>
                    <div className="card w25">
                        <strong>Intervenants inscrits</strong>
                        <div>{stats.intervenants}</div>
                    </div>
                    <div className="card w25">
                        <strong>Hors région</strong>
                        <div>{stats.horsRegion}</div>
                    </div>
                </div>

                <div className="mTop30">
                    <div className="flex gap20 aligncenter mBot30">
                        <div className="select w25">
                        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="input-select">
                            <option value="all">Tous (régions)</option>
                            <option value="hors">Participants hors région</option>
                        </select>
                        <span className="material-icons">expand_more</span>
                        </div>

                        <div className="select w25">
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-select">
                            <option value="all">Tous les rôles</option>
                            <option value="intervenants">Intervenants / Organisateurs</option>
                        </select>
                        <span className="material-icons">expand_more</span>
                        </div>

                        <div className="select w25">
                        <select value={selectedFonction} onChange={(e) => setSelectedFonction(e.target.value)} className="input-select">
                            <option value="">Toutes les fonctions</option>
                            {fonctions.map((fonctionObj, index) => (
                                <option key={index} value={fonctionObj.fonction}>{fonctionObj.fonction} ({fonctionObj.count})</option>
                            ))}
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>


                    <div className="select w25">
                    <select value={filterPresence} onChange={(e) => setFilterPresence(e.target.value)} className="input-select">
                        <option value="all">Tous les participants</option>
                        <option value="present">Présents uniquement</option>
                        <option value="absent">Désinscrits uniquement</option>
                    </select>
                    <span className="material-icons">expand_more</span>
                    </div>

                    </div>
                    <div className="flex gap20 aligncenter mBot30">     
                    <button className="btn__normal btn__light" onClick={() => setOpenAdd(prev => !prev)}>Ajouter un participant</button>              
                    <button className="btn__normal btn__light" onClick={() => setIsMail(prev => !prev)}>{isMail ? "Fermer" : "Envoyer un mail"}</button>
                    <button className="btn__normal btn__dark" onClick={() => exportToExcel(users, `Export liste des participants`)}>Exporter la liste des participants</button>
                    </div>
                    <div class="mBot30">
                        <div className="flex aligncenter gap10">
                            
                            <button className="btn__normal btn__dark" onClick={downloadAllBadges} disabled={loading}>
                                {loading ? 'Génération des badges, veuillez patienter...' : 'Télécharger tous les badges'}      
                            </button>
                        </div>
                        {loading && <p class="mBot30">Le téléchargement peut prendre du temps si le nombre de participants est élevé, veuillez patienter...</p>}
                    </div>
                    {isMail && (
                        <div className={styles.sendEmail}>
                            <h2>Envoyer un mail aux participants</h2>
                            <input type="text" value={subject} onChange={(event) => setSubject(event.target.value)} name="subject" className="input-text" placeholder="Sujet de l'email..." />
                            <div className={`mTop20 ${styles.Quill}`}>
                                <DynamicQuill theme="snow" value={editContent} onChange={setEditContent} />
                            </div>
                            <button onClick={preMail} className="btn__normal btn__dark mTop20">Envoyer l'e-mail</button>
                        </div>                        
                    )}
                    {openAdd && (
                        <div className={styles.sendEmail}>
                             <h2>Ajouter un participant</h2>
                            {userAdded == null ? (
                                <>
                                    <input type="text" onChange={(event) => chercherInscrit(event.target.value)} name="rechercheInscrit" className="input-text" placeholder="Chercher un inscrit..." />
                                    {openList && (
                                        <>
                                            <div className={styles.ListSearch}>
                                                {searchUsers.map((user, i) => {
                                                    return <button onClick={() => addUserFromList(user)} key={i}>{user.nom ? `${user.nom} ${user.prenom} ${user.mail}` : `[${user.type}] ${user.email}`}</button>
                                                })}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex aligncenter">
                                    <span>{userAdded.nom ? `${userAdded.nom} ${userAdded.prenom} ${userAdded.mail}` : `[${userAdded.type}] ${userAdded.email}`}</span>
                                    <button onClick={ajouterInscrit} className={styles.toAdd}>Ajouter</button>
                                    <button onClick={() => addUserFromList(null)} className={styles.toRem}><span className="material-icons">close</span></button>
                                </div>
                            )}
                        </div>  
                    )}



                    {users
                        .filter(user => {
                            if (selectedFonction && user.fonction !== selectedFonction) return false;
                            if (filterPresence === 'present' && user.deleted === true) return false;
                            if (filterPresence === 'absent' && user.deleted !== true) return false;
                            if (filterRegion === 'hors' && user.region === session.region) return false;
                            if (filterRole === 'intervenants' && !['intervenant', 'organisateur'].includes(user.role)) return false;
                            return true;
                        })
                        .sort((a, b) => {
                            const nameA = `${a.nom || ''} ${a.prenom || ''}`.toLowerCase();
                            const nameB = `${b.nom || ''} ${b.prenom || ''}`.toLowerCase();
                            return nameA.localeCompare(nameB);
                        })
                        .map((user, index) => (
                            <Participant key={index} data={user} setActions={setActions} session={session} />
                        ))
                    }


                    {users.length === 0 && <div><span>Pas de participant pour cette session.</span></div>}
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