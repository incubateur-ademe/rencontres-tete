import { useState, useEffect } from 'react'
import Participant from '@/components/Participant'
import * as XLSX from 'xlsx';
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

    const exportToExcel = (jsonArray, sheetName) => {
        const workbook = XLSX.utils.book_new();
        
        const worksheet = XLSX.utils.json_to_sheet(jsonArray);
        
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

    const getParticipants = async () => {
        const fetcher = await fetch(`/api/registrations/bySession?sessionId=${session.id}`)
        const json = await fetcher.json()
        if(json.length > 0){
            setNumber(json.length)
            setUsers(json)
            updateFonctions(json)
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

    useEffect(() => {
        getParticipants()
    }, [actions])

    return (
        <>
            <div className={styles.Participants}>
                <span onClick={() => setOpen(null)} className={styles.Back}>Retour aux sessions</span>
                <div className="mTop30">
                    <div className="flex gap20 aligncenter mBot30">                   
                    <div className="select w40">
                        <select value={selectedFonction} onChange={(e) => setSelectedFonction(e.target.value)} className="input-select">
                            <option value="">Toutes les fonctions</option>
                            {fonctions.map((fonctionObj, index) => (
                                <option key={index} value={fonctionObj.fonction}>{fonctionObj.fonction} ({fonctionObj.count})</option>
                            ))}
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>
                    <button className="btn__normal btn__dark" onClick={() => exportToExcel(users, `Participants Session ${session.region}`)}>Exporter la liste des participants</button>
                    <button className="btn__normal btn__light" onClick={() => setIsMail(prev => !prev)}>{isMail ? "Fermer" : "Envoyer un mail"}</button>
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

                    {users.filter(user => selectedFonction === '' || user.fonction === selectedFonction).map((user, index) => {
                        return <Participant key={index} data={user} setActions={setActions} session={session} />
                    })}
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