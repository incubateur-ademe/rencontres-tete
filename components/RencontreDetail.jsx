import Link from 'next/link';
import { useState, useEffect } from 'react';
import Alert from '@/components/Alert';
import { Notif } from '@/components/Notif';
import SessionBox from '@/components/SessionBox';
import Rating from '@mui/material/Rating';
import styles from '@/styles/Account.module.css';

export default function RencontreDetail({ id, registrationId, setOpen, userId, user }) {

    console.log("ID =>", registrationId)

    const [alert, setAlert] = useState(null);
    const [notif, setNotif] = useState(null);
    const [passed, setPassed] = useState(true);
    const [rating, setRating] = useState(0);
    const [commentaires, setCommentaires] = useState('');
    const [data, setData] = useState({});
    const [reviewDisabled, setReviewDisabled] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [otherInputs, setOtherInputs] = useState({});
    const [otherInputs2, setOtherInputs2] = useState({});
    const [responses, setResponses] = useState({});
    const [responses2, setResponses2] = useState({});
    const [hasResponded, setHasResponded] = useState(false);
    const [hasResponded2, setHasResponded2] = useState(false);
    const [after4month, setAfter4Month] = useState(false)

    const [modules, setModules] = useState([])

    const getModules = async () => {
        const geter = await fetch(`/api/modules`)
        const json = await geter.json()
        setModules(json)
    }

    console.log(responses)

    useEffect(() => {
        getModules()
    }, [])

    const questions = [
        {
            id: 1,
            text: "De 1 à 5, comment évaluez-vous la qualité générale de la Rencontre ?*",
            options: [
                { value: 5, label: "5/5 - Très satisfaisant" },
                { value: 4, label: "4/5 - Satisfaisant" },
                { value: 3, label: "3/5 - Moyennement satisfaisant" },
                { value: 2, label: "2/5 - Peu satisfaisant" },
                { value: 1, label: "1/5 - Pas du tout satisfaisant" },
            ],
        },
        {
            id: 2,
            text: "De 1 à 5, comment évaluez-vous la qualité du contenu technique partagé lors de la Rencontre ?*",
            options: [
                { value: 5, label: "5/5 - Très satisfaisant" },
                { value: 4, label: "4/5 - Satisfaisant" },
                { value: 3, label: "3/5 - Moyennement satisfaisant" },
                { value: 2, label: "2/5 - Peu satisfaisant" },
                { value: 1, label: "1/5 - Pas du tout satisfaisant" },
            ],
        },
        {
            id: 3,
            text: "De 1 à 5, comment évaluez-vous la pertinence des intervenants (expertises, témoignages ...) présents à la Rencontre ?*",
            options: [
                { value: 5, label: "5/5 - Très satisfaisant" },
                { value: 4, label: "4/5 - Satisfaisant" },
                { value: 3, label: "3/5 - Moyennement satisfaisant" },
                { value: 2, label: "2/5 - Peu satisfaisant" },
                { value: 1, label: "1/5 - Pas du tout satisfaisant" },
            ],
        },
        {
            id: 4,
            text: "De 1 à 5, comment évaluez-vous la richesse des échanges avec les autres participants durant la Rencontre ?*",
            options: [
                { value: 5, label: "5/5 - Très satisfaisant" },
                { value: 4, label: "4/5 - Satisfaisant" },
                { value: 3, label: "3/5 - Moyennement satisfaisant" },
                { value: 2, label: "2/5 - Peu satisfaisant" },
                { value: 1, label: "1/5 - Pas du tout satisfaisant" },
            ],
        },
        {
            id: 5,
            text: "De 1 à 5, comment évaluez-vous la qualité de l’animation (formats participatifs, dynamisme de l’animateur, etc.) de la Rencontre ?*",
            options: [
                { value: 5, label: "5/5 - Très satisfaisant" },
                { value: 4, label: "4/5 - Satisfaisant" },
                { value: 3, label: "3/5 - Moyennement satisfaisant" },
                { value: 2, label: "2/5 - Peu satisfaisant" },
                { value: 1, label: "1/5 - Pas du tout satisfaisant" },
            ],
        },
        {
            id: 6,
            text: "De 1 à 5 comment évaluez-vous la qualité de l’organisation de la Rencontre (inscription, communication, lieu, repas, etc.) ?*",
            options: [
                { value: 5, label: "5/5 - Très satisfaisant" },
                { value: 4, label: "4/5 - Satisfaisant" },
                { value: 3, label: "3/5 - Moyennement satisfaisant" },
                { value: 2, label: "2/5 - Peu satisfaisant" },
                { value: 1, label: "1/5 - Pas du tout satisfaisant" },
            ],
        },
        {
            id: 7,
            text: "Avez-vous d’autres commentaires, suggestions ou remarques à partager concernant cette Rencontre ?*",
            type: "textarea",
        },
        {
            id: 8,
            text: "Comment avez-vous connu les Rencontres Territoire Engagé Transition Ecologique ?*",
            options: [
                { value: "Via un emailing de la Direction Régionale de l'ADEME", label: "Via un emailing de la Direction Régionale de l'ADEME" },
                { value: "Via des articles de presse", label: "Via des articles de presse" },
                { value: "Via des post sur les réseaux sociaux comme LinkedIn ou X", label: "Via des post sur les réseaux sociaux comme LinkedIn ou X" },
                { value: "Via un des partenaires de l’ADEME", label: "Via un des partenaires de l’ADEME" },
                { value: "Via un évènement (salon, forum, etc.)", label: "Via un évènement (salon, forum, etc.)" },
                { value: "Via une autre collectivité qui a déjà participé à une Rencontre", label: "Via une autre collectivité qui a déjà participé à une Rencontre" },
                { value: "autre", label: "Autre : à préciser" },
            ],
            type: 'radioWithText',
        },
        {
            id: 9,
            text: "Il existe d’autres Rencontres Territoire Engagé Transition Ecologique. Quelles sont les thématiques susceptibles de vous intéresser ? (max. 5 réponses)",
            options: modules.map(module => ({ value: module.nom, label: module.nom })),
            type: "checkbox"
        }
    ];


    const questions2 = [
        {
            id: 1,
            text: "La Rencontre Territoire Engagé de l’ADEME a-t-elle eu un impact sur vos missions au quotidien ?",
            options: [
                { value: "4/4 – Très fort impact (changement d’une pratique, début d’un nouveau projet, ...)", label: "4/4 – Très fort impact (changement d’une pratique, début d’un nouveau projet, ...)" },
                { value: "3/4 – Fort impact (aide dans un projet en cours, utilisation d’un nouvel outil, ...)", label: "3/4 – Fort impact (aide dans un projet en cours, utilisation d’un nouvel outil, ...)" },
                { value: "2/4 – Impact relatif (prise de conscience, renforcement de connaissances, ...)", label: "2/4 – Impact relatif (prise de conscience, renforcement de connaissances, ...)" },
                { value: "1/4 – Aucun impact", label: "1/4 – Aucun impact" }
            ]
        },
        {
            id: 2,
            text: "Grâce à la Rencontre, avez-vous pu établir ou renforcer des collaborations avec d’autres participants ?",
            options: [
                { value: "Oui, une ou plusieurs collaborations", label: "Oui, une ou plusieurs collaborations" },
                { value: "J’ai pris des contacts lors de la Rencontre mais je n’ai pas encore donné suite", label: "J’ai pris des contacts lors de la Rencontre mais je n’ai pas encore donné suite" },
                { value: "Non, aucune collaboration", label: "Non, aucune collaboration" }
            ]
        },
        {
            id: 3,
            text: "Quels aspects de la Rencontre vous ont semblé particulièrement utiles pour vos missions au sein de votre collectivité ? (Exemples : nouvelles connaissances, découverte d’outils, ateliers thématiques, échanges avec les experts, retours d’expérience d’autres territoires, etc.)",
            type: "textarea",
        },
        {
            id: 4,
            text: "Identifiez-vous des pistes d’amélioration pour augmenter l’impact des prochaines Rencontres ? (Exemples : les thématiques abordées, le format des sessions, les retours d’expérience, etc.)",
            type: "textarea",
        },
        {
            id: 5,
            text: "Depuis votre participation à la Rencontre, votre collectivité s'est-elle engagée (ou davantage engagée) dans le programme Territoire Engagé Transition Écologique (TETE) ? (T.E.T.E.) ?",
            options: [
                { value: "La collectivité était déjà engagée dans le programme avant la Rencontre", label: "La collectivité était déjà engagée dans le programme avant la Rencontre" },
                { value: "Oui, la collectivité s'est engagé dans le programme après la Rencontre", label: "Oui, la collectivité s'est engagé dans le programme après la Rencontre" },
                { value: "Non, mais la collectivité envisage de s'engager dans le programme", label: "Non, mais la collectivité envisage de s'engager dans le programme" },
                { value: "Non, la collectivité ne prévoit pas de s'engager dans le programme pour le moment", label: "Non, la collectivité ne prévoit pas de s'engager dans le programme pour le moment" },
                { value: "Non concerné (je ne suis pas une collectivité)", label: "Non concerné (je ne suis pas une collectivité)" },
            ]
        },
    ];

    const handleOptionChange = (questionId, value, checked) => {
        setOtherInputs(prevState => ({
            ...prevState,
            [questionId]: value === 'autre',
        }));
    
        if (questions.find(q => q.id === questionId).type === 'checkbox') {
            setResponses(prevState => {
                const newValues = prevState[questionId] ? [...prevState[questionId]] : [];
                if (checked) {
                    newValues.push(value);
                } else {
                    const index = newValues.indexOf(value);
                    if (index > -1) {
                        newValues.splice(index, 1);
                    }
                }
                return {
                    ...prevState,
                    [questionId]: newValues,
                };
            });
        } else {
            setResponses(prevState => ({
                ...prevState,
                [questionId]: value,
            }));
        }
    };


    const handleOptionChange2 = (questionId, value, checked) => {
        setOtherInputs2(prevState => ({
            ...prevState,
            [questionId]: value === 'autre',
        }));
    
        if (questions.find(q => q.id === questionId).type === 'checkbox') {
            setResponses2(prevState => {
                const newValues = prevState[questionId] ? [...prevState[questionId]] : [];
                if (checked) {
                    newValues.push(value);
                } else {
                    const index = newValues.indexOf(value);
                    if (index > -1) {
                        newValues.splice(index, 1);
                    }
                }
                return {
                    ...prevState,
                    [questionId]: newValues,
                };
            });
        } else {
            setResponses2(prevState => ({
                ...prevState,
                [questionId]: value,
            }));
        }
    };
    

    const handleTextareaChange = (questionId, value) => {
        setResponses(prevState => ({
            ...prevState,
            [questionId]: value,
        }));
    };

    const handleOtherInputChange = (questionId, value) => {
        setResponses(prevState => ({
            ...prevState,
            [`${questionId}_autre`]: value,
        }));
    };

    const handleTextareaChange2 = (questionId, value) => {
        setResponses2(prevState => ({
            ...prevState,
            [questionId]: value,
        }));
    };

    const handleOtherInputChange2 = (questionId, value) => {
        setResponses2(prevState => ({
            ...prevState,
            [`${questionId}_autre`]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const requiredQuestions = questions;
        const unansweredQuestions = requiredQuestions.filter((q) => 
            !responses[q.id] || 
            (q.type === 'radioWithText' && responses[q.id] === 'autre' && !responses[`${q.id}_autre`]) || 
            (q.type === 'textarea' && !responses[q.id]) ||
            (q.type === 'checkbox' && (!responses[q.id] || responses[q.id].length === 0))
        );
    
        if (unansweredQuestions.length > 0) {
            setNotif({
                icon: 'warning',
                text: 'Veuillez répondre à toutes les questions obligatoires avant de soumettre.',
            });
            return;
        }
    
        const typeUser = user.type == "Administrateur" || user.type == "DR" ? "special" : "user";
    
        const response = await fetch('/api/satisfaction/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                sessionId: data.id,
                registrationId: registrationId,
                responses: responses,
                type: typeUser,
            }),
        });
    
        if (response.ok) {
            setNotif({
                icon: 'done',
                text: 'Votre réponse a été enregistrée avec succès.',
            });
            setHasResponded(true);
        } else {
            setNotif({
                icon: 'error',
                text: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
            });
        }
    };
    
    const handleSubmit2 = async (event) => {
        event.preventDefault();
    
        const requiredQuestions = questions2;
        const unansweredQuestions = requiredQuestions.filter((q) => 
            !responses2[q.id] || 
            (q.type === 'radioWithText' && responses2[q.id] === 'autre' && !responses2[`${q.id}_autre`]) || 
            (q.type === 'textarea' && !responses2[q.id]) ||
            (q.type === 'checkbox' && (!responses2[q.id] || responses2[q.id].length === 0))
        );
    
        if (unansweredQuestions.length > 0) {
            setNotif({
                icon: 'warning',
                text: 'Veuillez répondre à toutes les questions obligatoires avant de soumettre.',
            });
            return;
        }
    
        const typeUser = user.type == "Administrateur" || user.type == "DR" ? "special" : "user";
    
        const response = await fetch('/api/satisfaction-after/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                sessionId: data.id,
                registrationId: registrationId,
                responses: responses2,
                type: typeUser,
            }),
        });
    
        if (response.ok) {
            setNotif({
                icon: 'done',
                text: 'Votre réponse a été enregistrée avec succès.',
            });
            setHasResponded2(true);
        } else {
            setNotif({
                icon: 'error',
                text: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
            });
        }
    };

    function formatDate(dateString) {
        if (!dateString) return '---';
    
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
    
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    }
    
    

    function formatDate2(dateString) {
        if (!dateString) return '---';
    
        let date;
    
        if (dateString.includes('/')) {
            // Format "dd/mm/yyyy"
            const [day, month, year] = dateString.split('/');
            date = new Date(`${year}-${month}-${day}T00:00:00`);
        } else {
            // Format ISO standard
            date = new Date(dateString);
        }
    
        if (isNaN(date.getTime())) return 'Invalid Date';
    
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
    


    const getUserSession = async () => {
        const fetcher = await fetch(`/api/sessions/${id}`);
        const json = await fetcher.json();
        setData(json[0]);
    };

    const registerReview = async () => {
        setAlert(null);
        const typeUser = user.type == "Administrateur" || user.type == "DR" ? "special" : "user"
        const fetcher = await fetch('/api/reviews/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                note: rating,
                commentaire: commentaires,
                userId: userId,
                sessionId: data.id,
                type: typeUser
            }),
        });
        const json = await fetcher.json();
        if (json.id) {
            setNotif({
                text: 'Votre avis a bien été enregistré !',
                icon: 'done',
            });
            setReviewDisabled(true);
        }
    };
    
    const addReview = async () => {
        if (commentaires !== '') {
            setAlert({
                icon: 'warning',
                text: 'Une fois votre avis validé vous ne pourrez plus le modifier. Validez-vous votre avis ?',
                action: () => registerReview(),
            });
        } else {
            setNotif({
                text: "Vous n'avez pas laissé de commentaires.",
                icon: 'close',
            });
        }
    };
    
    const checkReview = async () => {
        if(user.type == "Administrateur" || user.type == "DR") {
            const fetcher = await fetch(`/api/reviews/check?userId=${userId}&sessionId=${data.id}&specialAccount=true`);
            const json = await fetcher.json();
            setReviewDisabled(true);
            if (json.length > 0) {
                setRating(json[0].note);
                setCommentaires(json[0].commentaire);
            } else {
                setReviewDisabled(false);
            }
        } else {
            const fetcher = await fetch(`/api/reviews/check?userId=${userId}&sessionId=${data.id}`);
            const json = await fetcher.json();
            setReviewDisabled(true);
            if (json.length > 0) {
                setRating(json[0].note);
                setCommentaires(json[0].commentaire);
            } else {
                setReviewDisabled(false);
            }
        }
    };

    const checkSatisfaction = async () => {
        if(user.type == "Administrateur" || user.type == "DR"){
            const fetcher = await fetch(`/api/satisfaction/checkSatisfaction?userId=${userId}&sessionId=${data.id}&specialAccount=true`);
            const json = await fetcher.json();
            setHasResponded(json.hasResponded);
        } else {
            const fetcher = await fetch(`/api/satisfaction/checkSatisfaction?userId=${userId}&sessionId=${data.id}`);
            const json = await fetcher.json();
            setHasResponded(json.hasResponded);
        }
    };

    const checkSatisfactionAfter = async () => {
        if(user.type == "Administrateur" || user.type == "DR"){
            const fetcher = await fetch(`/api/satisfaction-after/checkSatisfaction?userId=${userId}&sessionId=${data.id}&specialAccount=true`);
            const json = await fetcher.json();
            setHasResponded2(json.hasResponded);
        } else {
            const fetcher = await fetch(`/api/satisfaction-after/checkSatisfaction?userId=${userId}&sessionId=${data.id}`);
            const json = await fetcher.json();
            setHasResponded2(json.hasResponded);
        }
    };

    useEffect(() => {
        getUserSession();
    }, []);

    useEffect(() => {
        if (data.id) {
            checkReview();
            checkSatisfaction();
            checkSatisfactionAfter();
        }
    }, [data]);

    useEffect(() => {
        if (data && data.dateDebut) {
            const now = new Date();
            const dateDebut = new Date(data.dateDebut);

            if (dateDebut > now) {
                setPassed(false);
            } else {
                setPassed(true);
            }
        }
    }, [data]);

    useEffect(() => {
        if (data && data.dateDebut) {
            const now = new Date();
            const dateDebut = new Date(data.dateDebut);
    
            const fourMonthsAgo = new Date();
            fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    
            if (dateDebut < fourMonthsAgo) {
                setAfter4Month(true); // La session est passée depuis plus de 4 mois
            } else {
                setAfter4Month(false); // Moins de 4 mois
            }
        }
    }, [data]);
    

    useEffect(() => {
        if (user) {
            if(user.type == "Administrateur" || user.type == "DR"){
                const getUserIn = async () => {
                    const fetcher = await fetch(`/api/accounts/${user.id}`);
                    const json = await fetcher.json();
                    setUserData(json[0]);
                };
                getUserIn();
            } else {
                const getUserIn = async () => {
                    const fetcher = await fetch(`/api/users/${user.id}`);
                    const json = await fetcher.json();
                    setUserData(json[0]);
                };
                getUserIn();
            }
        }
    }, [user]);

    const generateBadge = async () => {
        setLoading(true);

        console.log("userData", userData)

        const datas = {
            nom: (data.nom !== undefined && data.nom !== null && data.nom !== "") ? data.nom : userData.email,
            prenom: data.prenom || '[ADMIN / DR]',
            program: data?.metasSession?.programmeSession,
            organisation: userData.organisation || "",
        };

        const response = await fetch('/api/generate-badge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = "Badge de participation.pdf";
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setLoading(false);
    };

    const tryCancel = async () => {
        setAlert({
            icon: 'warning',
            text: 'Êtes-vous sur de ne plus vouloir participer à cette rencontre ?',
            action: () => cancel(),
        });
    };

    const cancel = async () => {
        if(user.type == "Administrateur" || user.type == "DR"){
            const fetcher = await fetch('/api/registrations/cancel', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    sessionId: id,
                    type: "special"
                }),
            });
            const json = await fetcher.json();
            setOpen(null);
        } else {
            const fetcher = await fetch('/api/registrations/cancel', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    sessionId: id,
                    type: "user"
                }),
            });
            const json = await fetcher.json();
            setOpen(null);
        }
    };

    const transformLinks = (html) => {
        // Cette regex trouve les liens et capture l'URL
        const urlRegex = /<a href="(http[s]?:\/\/.*?)".*?>(.*?)<\/a>/g;
        
        return html.replace(urlRegex, (match, url, linkText) => {
          // Remplacez "Cliquez ici" par le texte que vous voulez montrer comme lien
          const clickableText = "Lien externe";
          
          // Retourne le HTML modifié avec le texte cliquable qui garde l'URL comme destination
          return `<a target="_blank" rel="noreferer noopener" href="${url}">${clickableText}</a>`;
        });
      };

    const [transformedHTML, setTransformedHTML] = useState('')

    useEffect(() => {
        if(data?.metasSession?.explications){
            setTransformedHTML(transformLinks(data?.metasSession?.explications))
        }
    }, [data])
    

    return (
        <>
            <span onClick={() => setOpen(null)} className={styles.Back}>Retour à mes rencontres</span>
            <div className="mTop20 flex aligncenter toColumn gap10">
                {/* <button onClick={generateBadge} className="btn__normal btn__dark">Générer mon badge</button> */}
                <button onClick={tryCancel} className="btn__normal btn__dark">Je souhaite retirer mon inscription</button>
            </div>
            <div className="w100 mTop25">
                <SessionBox
                    date={data.dateDebut}
                    region={data.region}
                    title={data?.module?.nom}
                    dept={data?.departement}
                    register="false"
                    see='true'
                    data={data}
                    detail="yes"
                />
            </div>
            <div className="flex alignstart gap30 mTop30">
                <div className="flex alignstart gap10 w35">
                    <div className="w7">
                        <img src="/medias/icon-lieu.png" alt="icon" className="w80" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Lieu de la rencontre :</span>
                        <span className={styles.dValue}>{data.metasSession !== undefined ? data.metasSession.lieuRencontre : 'Chargement...'}</span>
                    </div>
                </div>
                <div className="flex alignstart gap10 w20">
                    <div className="w10">
                        <img src="/medias/icon-date.png" alt="icon" className="w90" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Date :</span>
                        <span className={styles.dValue}>{data !== undefined ? formatDate2(data?.dateDebut) : 'Chargement...'}</span>
                    </div>
                </div>
                <div className="flex alignstart gap10 w20">
                    <div className="w10">
                        <img src="/medias/icon-date.png" alt="icon" className="w90" />
                    </div>
                    <div className="w80">
                        <span className={styles.dLabel}>Tarif :</span>
                        <span className={styles.dValue}>{data.module !== undefined ? data.module.metasModule.tarif : 'Chargement...'}</span>
                    </div>
                </div>
            </div>
            <span className={styles.Subtitle}>En savoir plus sur ce module :</span>
            <p>{data.module !== undefined ? data.module.description : 'Chargement...'}</p>
            
            {(data?.metasSession?.urlsPDF.length > 0 || data?.metasSession?.explications) ? (
                <div className="mBot20">
                    <h3 style={{ fontWeight: '500' }}>Ressources en amont de la Rencontre</h3>
                    <span className={styles.Subtitle}>Ressources :</span>
                    <div className={styles.Align}>
                        {data?.metasSession?.explications && (
                            <div dangerouslySetInnerHTML={{ __html: data.metasSession.explications }}></div>
                        )}
                    </div>
                    {data?.metasSession?.urlsPDF.length > 0 && (
                        <ul className={styles.Ressources}>
                            {data?.metasSession?.urlsPDF.map((item, index) => (
                                <li key={index}><Link target="_blank" href={item.url}>{item.nom}</Link></li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div>
                    <span className={styles.Subtitle}>Ressources en amont de la rencontre :</span>
                    <span className="block mTop20">Pas de ressources en amont de la rencontre disponibles.</span>
                    {data?.metasSession?.mail_referent != null && data.metasSession.mail_referent !== undefined && (
                        <>
                            <span className={styles.Subtitle}>Contact du référent :</span>
                            <span className="block mTop20">{data.metasSession.mail_referent}</span>
                        </>
                    )}
                </div>
            )}

            {((Array.isArray(data?.metasSession?.urlsPDFAval) && data.metasSession.urlsPDFAval.length > 0) 
            || data?.metasSession?.explicationsAval) && (
            <div className="mBot20">
                <h3 style={{ fontWeight: '500' }}>Ressources post-rencontre</h3>
                <span className={styles.Subtitle}>Ressources :</span>
                <div className={styles.Align}>
                {data.metasSession.explicationsAval && (
                    <div dangerouslySetInnerHTML={{ __html: data.metasSession.explicationsAval }}></div>
                )}
                </div>
                {Array.isArray(data.metasSession.urlsPDFAval) && (
                <ul className={styles.Ressources}>
                    {data.metasSession.urlsPDFAval.map((item, index) => (
                    <li key={index}><Link target="_blank" href={item.url}>{item.nom}</Link></li>
                    ))}
                </ul>
                )}
            </div>
            )}


            {passed && !hasResponded && (
                <>
                    {/* <span className={styles.Subtitle}>Donnez votre avis sur la rencontre :</span>
                    <div className="mTop15">
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            size="small"
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </div>
                    <textarea disabled={reviewDisabled} name="commentaires" value={commentaires} onChange={(event) => setCommentaires(event.target.value)} className="textarea mTop15"></textarea>
                    {!reviewDisabled && (
                        <div className='mTop20 flex alignright'>
                            <button onClick={addReview} className="btn__normal btn__dark">Valider mon avis</button>
                        </div>
                    )} */}
                    <h3 style={{ fontWeight: '500' }}>Questionnaire de satisfaction :</h3>
                    <span className={styles.Subtitle}>Nous vous remercions de prendre 5 minutes pour répondre à ce questionnaire de satisfaction. Vos réponses permettront d’améliorer l’offre des Rencontres Territoire Engagé Transition Ecologique de l’ADEME.</span>
                    <form onSubmit={handleSubmit}>
                        {questions.map((question) => (
                            <div key={question.id}>
                                <span className={styles.askTitle}>{question.id}) {question.text}</span>
                                {question.type === "textarea" ? (
                                    <p className={styles.asker}>
                                        <textarea
                                            name={`question_${question.id}`}
                                            id={`question_${question.id}`}
                                            rows="4"
                                            cols="50"
                                            value={responses[question.id] || ''}
                                            className={styles.textareaF}
                                            onChange={(e) => handleTextareaChange(question.id, e.target.value)}
                                        ></textarea>
                                    </p>
                                ) : (
                                    question.type === "checkbox" ? (
                                        question.options.map((option, index) => (
                                            <div key={index}>
                                                <p className={styles.asker}>
                                                    <input
                                                        type="checkbox"
                                                        name={`question_${question.id}`}
                                                        id={`question_${question.id}_${option.value}`}
                                                        value={option.value}
                                                        checked={(responses[question.id] || []).includes(option.value)}
                                                        onChange={(e) => handleOptionChange(question.id, option.value, e.target.checked)}
                                                    />
                                                    <label htmlFor={`question_${question.id}_${option.value}`}>{option.label}</label>
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        question.options.map((option, index) => (
                                            <div key={index}>
                                                <p className={styles.asker}>
                                                    <input
                                                        type="radio"
                                                        name={`question_${question.id}`}
                                                        id={`question_${question.id}_${option.value}`}
                                                        value={option.value}
                                                        onChange={() => handleOptionChange(question.id, option.value)}
                                                    />
                                                    <label htmlFor={`question_${question.id}_${option.value}`}>{option.label}</label>
                                                </p>
                                                {option.value === 'autre' && otherInputs[question.id] && (
                                                    <p className={styles.asker}>
                                                        <input
                                                            type="text"
                                                            name={`question_${question.id}_autre`}
                                                            id={`question_${question.id}_autre`}
                                                            placeholder="Veuillez préciser"
                                                            value={responses[`${question.id}_autre`] || ''}
                                                            className={styles.textF}
                                                            onChange={(e) => handleOtherInputChange(question.id, e.target.value)}
                                                        />
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        ))}
                        <button className="btn__normal btn__dark mBot20 mTop10" type="submit">Soumettre</button>
                    </form>

                </>
            )}
            {hasResponded && (
                <div className="mTop30 mBot20">
                    <span className={styles.Subtitle}>Merci pour votre participation.</span>
                </div>
            )}

            {(after4month && !hasResponded2) && (
                <>
                    <h3 style={{ fontWeight: '500' }}>Questionnaire d'Impact :</h3>
                    <span className={styles.Subtitle}>Vous avez participé à une Rencontre Territoire Engagé de l’ADEME sur la thématique : {data?.module?.nom}. Afin d’évaluer l’impact que cette Rencontre a eu sur vos missions et vos projets, nous vous invitons à répondre à ce questionnaire. Cela ne vous demandera que quelques minutes !</span>
                
                    <form onSubmit={handleSubmit2}>
                        {questions2.map((question) => (
                            <div key={question.id}>
                                <span className={styles.askTitle}>{question.id}) {question.text}</span>
                                {question.type === "textarea" ? (
                                    <p className={styles.asker}>
                                        <textarea
                                            name={`question_${question.id}`}
                                            id={`question_${question.id}`}
                                            rows="4"
                                            cols="50"
                                            value={responses2[question.id] || ''}
                                            className={styles.textareaF}
                                            onChange={(e) => handleTextareaChange2(question.id, e.target.value)}
                                        ></textarea>
                                    </p>
                                ) : (
                                    question.type === "checkbox" ? (
                                        question.options.map((option, index) => (
                                            <div key={index}>
                                                <p className={styles.asker}>
                                                    <input
                                                        type="checkbox"
                                                        name={`question_${question.id}`}
                                                        id={`question_${question.id}_${option.value}`}
                                                        value={option.value}
                                                        checked={(responses[question.id] || []).includes(option.value)}
                                                        onChange={(e) => handleOptionChange2(question.id, option.value, e.target.checked)}
                                                    />
                                                    <label htmlFor={`question_${question.id}_${option.value}`}>{option.label}</label>
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        question.options.map((option, index) => (
                                            <div key={index}>
                                                <p className={styles.asker}>
                                                    <input
                                                        type="radio"
                                                        name={`question_${question.id}`}
                                                        id={`question_${question.id}_${option.value}`}
                                                        value={option.value}
                                                        onChange={() => handleOptionChange2(question.id, option.value)}
                                                    />
                                                    <label htmlFor={`question_${question.id}_${option.value}`}>{option.label}</label>
                                                </p>
                                                {option.value === 'autre' && otherInputs[question.id] && (
                                                    <p className={styles.asker}>
                                                        <input
                                                            type="text"
                                                            name={`question_${question.id}_autre`}
                                                            id={`question_${question.id}_autre`}
                                                            placeholder="Veuillez préciser"
                                                            value={responses2[`${question.id}_autre`] || ''}
                                                            className={styles.textF}
                                                            onChange={(e) => handleOtherInputChange2(question.id, e.target.value)}
                                                        />
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        ))}
                        <button className="btn__normal btn__dark mBot20 mTop10" type="submit">Soumettre</button>
                    </form>
                </>
            )}

            {hasResponded2 && (
                <div className="mTop30 mBot20">
                    <span className={styles.Subtitle}>Retour sur la rencontre :</span>
                    <p>Il y 3 mois, vous avez participé à une Rencontre Territoire Engagé de l’ADEME sur la thématique : {data?.module?.nom}. Afin d’évaluer l’impact que cette Rencontre a eu sur vos missions et vos projets, nous vous invitons à répondre à ce questionnaire. Cela ne vous demandera que quelques minutes !</p>
                    <span className={styles.Subtitle}>Nous vous remercions d’avoir pris le temps de répondre à ce questionnaire. Vos retours sont essentiels pour faire évoluer les Rencontres Territoire Engagé et répondre aux mieux à vos besoins.</span>
                </div>
            )}

            {alert != null && (
                <Alert datas={alert} setAlert={setAlert} />
            )}
            {notif != null && (
                <Notif datas={notif} setNotif={setNotif} />
            )}
            {loading && (
                <div className={styles.Loading}>
                    <img src="/medias/loading.gif" alt="loading" />
                </div>
            )}
        </>
    );
}
