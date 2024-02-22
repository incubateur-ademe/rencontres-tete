import { useState, useEffect } from 'react'
import Participant from '@/components/Participant'
import * as XLSX from 'xlsx';
import styles from '@/styles/Participants.module.css'

export default function Participants({ session, setOpen }){

    const [number, setNumber] = useState(0)
    const [users, setUsers] = useState([])
    const [actions, setActions] = useState(0)

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
        }
    }
    

    useEffect(() => {
        getParticipants()
    }, [actions])

    return (
        <>
            <div className={styles.Participants}>
                <span onClick={() => setOpen(null)} className={styles.Back}>Retour aux sessions</span>
                <div className="flex aligncenter space-between w100 gap40 mTop30">
                    <span className={`${styles.Title} w65`}>{session.moduleName} <br />Inscriptions à la session du {formatDate(session.dateDebut)}, {session.region}</span>
                    <span className={styles.Number}><span className="material-icons">people</span><strong>{number} participant{number > 1 && 's'}</strong></span>                
                </div>
                <div className="mTop30">
                    <button className="btn__normal btn__dark mBot30" onClick={() => exportToExcel(users, `Participants Session ${session.region}`)}>Exporter la liste des participants</button>
                    {users.length > 0 ? (
                        <>
                            {users.map((user, index) => {
                                return <Participant key={index} data={user} setActions={setActions} />
                            })}
                        </>
                    ) : (
                        <span>Pas de participant pour cette session.</span>
                    )}
                </div>
            </div>
        </>
    )
}