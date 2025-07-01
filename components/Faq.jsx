import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'

export default function Faq({ setOpen, id, nom }) {
  const [faqList, setFaqList] = useState(
    Array.from({ length: 10 }, () => ({ question: '', reponse: '' }))
  )

  const saveModifs = async () => {
    try {
      const res = await fetch('/api/faq/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqList }) // bien `faqList`, pas `faq`
      })
      
      if (res.ok) {
        alert('FAQ enregistrée avec succès')
      } else {
        alert('Erreur lors de l’enregistrement')
      }
    } catch (error) {
      console.error(error)
      alert('Erreur serveur')
    }
  }

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faq/list')
        const data = await res.json()

        console.log(data)

        // On remplit les 10 champs avec les données récupérées (s’il y en a)
        const filledList = Array.from({ length: 10 }, (_, i) => data.faqs[i] || { question: '', reponse: '' })
        setFaqList(filledList)
      } catch (err) {
        console.error('Erreur lors du chargement des FAQs:', err)
      }
    }

    fetchFaqs()
  }, [])


  return (
    <>
      <div className="flex aligncenter space-between w100">
        <span className={`${styles.Title} w70`}>
          Foire aux questions<br />{nom}
        </span>
        <button onClick={saveModifs} className="btn__normal btn__dark w23">Enregistrer</button>
      </div>

      <div className="faq-list" style={{ marginTop: '2rem' }}>
        {faqList.map((item, index) => (
          <div key={index} className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder={`Question ${index + 1}`}
              value={item.question}
              onChange={(e) => {
                const updated = [...faqList]
                updated[index].question = e.target.value
                setFaqList(updated)
              }}
              className="w100 input-text"
            />
            <textarea
              placeholder={`Réponse ${index + 1}`}
              value={item.reponse}
              onChange={(e) => {
                const updated = [...faqList]
                updated[index].reponse = e.target.value
                setFaqList(updated)
              }}
              className="w100 textarea"
              rows={4}
              style={{ marginTop: '0.5rem' }}
            />
          </div>
        ))}
      </div>
    </>
  )
}
