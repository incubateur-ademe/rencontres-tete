import { useState, useEffect } from 'react' 
import Review from '@/components/Review'
import styles from '@/styles/Reviews.module.css'

export default function Reviews({ session, setOpen }){

    const [number, setNumber] = useState(0)
    const [reviews, setReviews] = useState([])
    const [moyenne, setMoyenne] = useState(0)

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const getParticipants = async () => {
        const fetcher = await fetch(`/api/reviews/bySession?sessionId=${session.id}`)
        const json = await fetcher.json()
        if(json.length > 0){
            setNumber(json.length)
            setReviews(json)
            const sommeNotes = json.reduce((acc, review) => acc + review.note, 0);
            const moyenneNotes = sommeNotes / json.length;
            setMoyenne(moyenneNotes)
        }
    }

    useEffect(() => {
        getParticipants()
    }, [])

    console.log(reviews)

    return (
        <>  
            <div className={styles.Reviews}>
                <span onClick={() => setOpen(null)} className={styles.Back}>Retour aux sessions</span>
                <div className="flex aligncenter space-between w100 gap40 mTop30">
                    <span className={`${styles.Title} w60`}>{session.moduleName} <br />Avis sur la session du {formatDate(session.dateDebut)}, {session.region}</span>
                    <div className="flex aligncenter gap10">
                        <span className={styles.Number}><span className="material-icons">reviews</span>{number} avis</span>
                        <span className={styles.Number}><span className="material-icons">insights</span>{moyenne > 0 ? moyenne : '-'}/5 de moyenne</span>
                    </div>
                    
                </div>
                <div className="mTop30">
                    {reviews.length > 0 ? (
                        <>
                            {reviews.map((review, index) => {
                                return <Review key={index} data={review} />
                            })}
                        </>
                    ) : (
                        <span>Aucun avis pour cette session.</span>
                    )}
                </div>
            </div>
        </>
    )
}