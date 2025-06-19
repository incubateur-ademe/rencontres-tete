import React, { useState, useEffect } from 'react';
import Review from '@/components/Review';
import * as XLSX from 'xlsx';
import styles from '@/styles/Reviews.module.css';

export default function Reviews({ session, setOpen }) {
    const [number, setNumber] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [moyenne, setMoyenne] = useState(0);
    const [quizz, setQuizz] = useState([]);
    const [quizz2, setQuizz2] = useState([])
    

    function formatDate(dateString) {
        if (!dateString) return '---';
    
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
    
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

    const getQuizz2 = async () => {
        try {
            const fetcher = await fetch(`/api/satisfaction-after/fromSession?sessionId=${session.id}`);
            const json = await fetcher.json();
            console.log("Récupéré depuis l'API: ", json); // Vérifier les données
    
            if (json.length > 0) {
                setQuizz2(json);
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
        "4": "Richesse des échanges",
        "5": "Qualité de l'animation",
        "6": "Qualité de l'organisation",
        "7": "Commentaires",
        "8": "Comment avez-vous connu",
        "9": "Thématique succeptible d'intéresser"
    };

    const questionLabels2 = {
        "1": "Impact sur vos missions au quotidien",
        "2": "Collaborations avec d’autres participants",
        "3": "Aspects de la Rencontre pertinents",
        "4": "Pistes d’amélioration",
        "5": "Votre collectivité s'est-elle engagée"
    };

    useEffect(() => {
        getQuizz()
        getQuizz2()
    }, [])


    const exportToExcel = () => {
        const dataQuizz = quizz.map((question) => {
            const responses = question.responses;
            let participant;
            let registrationData = {};
    
            if (question.User) {
                participant = `${question.User.nom} ${question.User.prenom}`;
                const registration = question.User.registrations?.[0];
                if (registration) {
                    registrationData = {
                        Ville: registration.ville || '-',
                        Structure: registration.structure || '-',
                        Fonction: registration.fonction || '-',
                        Type_Fonction: registration.typeFonction || '-',
                    };
                }
            } else if (question.Account) {
                participant = `${question.Account.email} (${question.Account.type})`;
                const accountRegistration = question.Account.accountRegistrations?.[0];
                if (accountRegistration) {
                    registrationData = {
                        Ville: accountRegistration.ville || '-',
                        Structure: accountRegistration.structure || '-',
                        Fonction: accountRegistration.fonction || '-',
                        Type_Fonction: accountRegistration.typeFonction || '-',
                    };
                }
            }
    
            const row = { Participant: participant, ...registrationData };
    
            Object.entries(responses).forEach(([questionId, response]) => {
                row[questionLabels[questionId] || `Question ${questionId}`] = Array.isArray(response) ? response.join(', ') : response;
            });
    
            return row;
        });
    
        const dataQuizz2 = quizz2.map((question) => {
            const responses = question.responses;
            let participant;
            let registrationData = {};
    
            if (question.User) {
                participant = `${question.User.nom} ${question.User.prenom}`;
                const registration = question.User.registrations?.[0];
                if (registration) {
                    registrationData = {
                        Ville: registration.ville || '-',
                        Structure: registration.structure || '-',
                        Fonction: registration.fonction || '-',
                        Type_Fonction: registration.typeFonction || '-',
                    };
                }
            } else if (question.Account) {
                participant = `${question.Account.email} (${question.Account.type})`;
                const accountRegistration = question.Account.accountRegistrations?.[0];
                if (accountRegistration) {
                    registrationData = {
                        Ville: accountRegistration.ville || '-',
                        Structure: accountRegistration.structure || '-',
                        Fonction: accountRegistration.fonction || '-',
                        Type_Fonction: accountRegistration.typeFonction || '-',
                    };
                }
            }
    
            const row = { Participant: participant, ...registrationData };
    
            Object.entries(responses).forEach(([questionId, response]) => {
                row[questionLabels2[questionId] || `Question ${questionId}`] = Array.isArray(response) ? response.join(', ') : response;
            });
    
            return row;
        });
    
        const workbook = XLSX.utils.book_new();
    
        const worksheet1 = XLSX.utils.json_to_sheet(dataQuizz);
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'Satisfaction');
    
        const worksheet2 = XLSX.utils.json_to_sheet(dataQuizz2);
        XLSX.utils.book_append_sheet(workbook, worksheet2, 'Impact');
    
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
                <div className="mTop30">
                    <h3 className="mTop20">Questionnaires d'impact :</h3>
                    {quizz2.length > 0 ? (
                        <>
                            {quizz2.map((question, index) => {
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
                        <span className="block mTop20">Aucun questionnaire d'impact pour le moment.</span>
                    )}
                </div>
            </div>
        </>
    );
}
