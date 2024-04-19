import { useState, useEffect } from 'react'
import Participant from '@/components/Participant'
import * as XLSX from 'xlsx';
import styles from '@/styles/Participants.module.css'

export default function Participants({ session, setOpen }){

    const [number, setNumber] = useState(0)
    const [users, setUsers] = useState([])
    const [actions, setActions] = useState(0)
    const [fonctions, setFonctions] = useState([])
    const [selectedFonction, setSelectedFonction] = useState('') 

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
        console.log(json)
        if(json.length > 0){
            setNumber(json.length)
            setUsers(json)
            updateFonctions(json)
        }
    }

    const updateFonctions = (participants) => {
        const allFonctions = participants.map(participant => participant.fonction);
        const uniqueFonctions = Array.from(new Set(allFonctions));
        setFonctions(uniqueFonctions);
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
                            {fonctions.map((fonction, index) => (
                                <option key={index} value={fonction}>{fonction}</option>
                            ))}
                        </select>
                        <span className="material-icons">expand_more</span>
                    </div>
                    <button className="btn__normal btn__dark" onClick={() => exportToExcel(users, `Participants Session ${session.region}`)}>Exporter la liste des participants</button>
                    </div>
                    {users.filter(user => selectedFonction === '' || user.fonction === selectedFonction).map((user, index) => {
                        return <Participant key={index} data={user} setActions={setActions} />
                    })}
                    {users.length === 0 && <div><span>Pas de participant pour cette session.</span></div>}
                </div>
            </div>
        </>
    )
}