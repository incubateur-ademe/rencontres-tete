import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'

export default function Avis({ setOpen }) {
  const [avisList, setAvisList] = useState(
    Array.from({ length: 10 }, () => ({
      prenom: '',
      thematique: '',
      date: '',
      contenu: ''
    }))
  )

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const res = await fetch('/api/avis/list')
        const data = await res.json()

        const filled = Array.from({ length: 10 }, (_, i) => {
          const a = data[i]
          return a
            ? {
                prenom: a.prenom,
                thematique: a.thematique,
                date: a.date.split('T')[0], // format yyyy-mm-dd
                contenu: a.contenu
              }
            : { prenom: '', thematique: '', date: '', contenu: '' }
        })

        setAvisList(filled)
      } catch (err) {
        console.error('Erreur chargement avis:', err)
      }
    }

    fetchAvis()
  }, [])

  const saveAvis = async () => {
    try {
      const res = await fetch('/api/avis/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avisList }),
      })

      if (res.ok) {
        alert('Avis enregistrés')
      } else {
        alert('Erreur')
      }
    } catch (err) {
      console.error(err)
      alert('Erreur serveur')
    }
  }

  return (
    <>
      <div className="flex aligncenter space-between w100">
        <span className={`${styles.Title} w70`}>Avis utilisateurs</span>
        <button onClick={saveAvis} className="btn__normal btn__dark w23">Enregistrer</button>
      </div>

      <div className="avis-list" style={{ marginTop: '2rem' }}>
        {avisList.map((item, index) => (
          <div key={index} className="avis-item" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Prénom"
              value={item.prenom}
              onChange={(e) => {
                const updated = [...avisList]
                updated[index].prenom = e.target.value
                setAvisList(updated)
              }}
              className="w100 input input-text mBot10"
            />
            <input
              type="text"
              placeholder="Thématique"
              value={item.thematique}
              onChange={(e) => {
                const updated = [...avisList]
                updated[index].thematique = e.target.value
                setAvisList(updated)
              }}
              className="w100 input input-text mBot10"
            />
            <input
              type="date"
              value={item.date}
              onChange={(e) => {
                const updated = [...avisList]
                updated[index].date = e.target.value
                setAvisList(updated)
              }}
              className="w100 input input-text"
            />
            <textarea
              placeholder="Contenu de l’avis"
              value={item.contenu}
              onChange={(e) => {
                const updated = [...avisList]
                updated[index].contenu = e.target.value
                setAvisList(updated)
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
