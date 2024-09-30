import React, { useState, useEffect } from 'react';
import Review from '@/components/Review';
import * as XLSX from 'xlsx';
import styles from '@/styles/Reviews.module.css';

export default function Reviews({ session, setOpen }) {
    const [number, setNumber] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [moyenne, setMoyenne] = useState(0);
    const [quizz, setQuizz] = useState([]);

    console.log(session);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // const getParticipants = async () => {
    //     const fetcher = await fetch(`/api/reviews/bySession?sessionId=${session.id}`);
    //     const json = await fetcher.json();
    //     if (json.length > 0) {
    //         setNumber(json.length);
    //         setReviews(json);
    //         const sommeNotes = json.reduce((acc, review) => acc + review.note, 0);
    //         const moyenneNotes = sommeNotes / json.length;
    //         setMoyenne(moyenneNotes);
    //         console.log("JSON => ", json);
    //     }
    // };

    const getQuizz = async () => {
        try {
            const fetcher = await fetch(`/api/satisfaction/fromSession?sessionId=${session.id}`);
            const json = await fetcher.json();
            console.log("Récupéré depuis l'API: ", json); // Vérifier les données
    
            if (json.length > 0) {
                setQuizz(json);
            } else {
                console.log("Aucune donnée de satisfaction récupérée.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des questionnaires : ", error);
        }
    };
    

    const questionLabels = {
        "1": "Qualité générale",
        "2": "Qualité du contenu technique",
        "3": "Pertinence des intervenant.e.s",
        "4": "Qualité des formats participatifs",
        "5": "Richesse des échanges",
        "6": "Qualité de l'organisation",
        "7": "Commentaires",
        "8": "Comment avez-vous connu",
        "9": "Nombre de participations",
        "10": "Thématiques intéressantes"
    };

    useEffect(() => {
        console.log("Session info: ", session); // Vérifie que la session est bien définie
        getQuizz();
    }, []);

    const exportToExcel = () => {
        const data = quizz.map((question) => {
            const responses = question.responses;
            const participant = question.User
                ? `${question.User.nom} ${question.User.prenom}` 
                : `${question.Account.email} (${question.Account.type})`;
            const row = { Participant: participant };
            Object.entries(responses).forEach(([questionId, response]) => {
                if (Array.isArray(response)) {
                    row[questionLabels[questionId] || `Question ${questionId}`] = response.join(', ');
                } else {
                    row[questionLabels[questionId] || `Question ${questionId}`] = response;
                }
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Quizz');

        XLSX.writeFile(workbook, `questionnaires_session_${session.id}.xlsx`);
    };

    return (
        <>
            <div className={styles.Reviews}>
                <span onClick={() => setOpen(null)} className={styles.Back}>Retour aux sessions</span>
                <div className="flex aligncenter space-between w100 gap40 mTop30">
                    <span className={`${styles.Title} w60`}>
                        {session.moduleName} <br />
                        Avis sur la session du {formatDate(session.dateDebut)}, {session.region}
                    </span>
                </div>
                <div className="mTop30">
                    <h3 className="mTop20">Questionnaires de satisfaction :</h3>
                    {quizz.length > 0 ? (
                        <>
                            <button onClick={exportToExcel} className="exportButton btn__normal btn__light mTop15">Exporter en Excel</button>
                            {quizz.map((question, index) => {
                                const responses = question.responses;
                                const participant = question.User
                                    ? `${question.User.nom} ${question.User.prenom}`
                                    : `${question.Account.email} (${question.Account.type})`;

                                return (
                                    <table className={styles.Quizzer} border="1" key={index}>
                                        <tbody>
                                            <tr>
                                                <td>Participant</td>
                                                <td>{participant}</td>
                                            </tr>
                                            {Object.entries(responses).map(([questionId, response], idx) => (
                                                <React.Fragment key={idx}>
                                                    {Array.isArray(response) ? (
                                                        response.map((resp, respIdx) => (
                                                            <tr key={respIdx}>
                                                                <td>{questionLabels[questionId] || `Question ${questionId}`} ({respIdx + 1})</td>
                                                                <td>{resp}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td>{questionLabels[questionId] || `Question ${questionId}`}</td>
                                                            <td>{response}</td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })}
                        </>
                    ) : (
                        <span className="block mTop20">Aucun questionnaire de satisfaction.</span>
                    )}
                </div>
            </div>
        </>
    );
}
