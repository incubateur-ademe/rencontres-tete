import { useState, useEffect, useRef } from 'react'
import styles from '@/styles/Verbatims.module.css'

export default function Verbatims() {
  const [avis, setAvis] = useState([])
  const [expanded, setExpanded] = useState({})
  const sliderRef = useRef(null)

  useEffect(() => {
    fetch('/api/avis/list')
      .then((res) => res.json())
      .then((data) => setAvis(data))
      .catch((err) => console.error('Erreur FAQ:', err))
  }, [])

  const scroll = (direction) => {
    const container = sliderRef.current
    const scrollAmount = 350
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className={styles.box}>
      <div className={styles.wrapper}>
        <button className={styles.navLeft} onClick={() => scroll('left')}><span className="material-icons">chevron_left</span></button>
        <div className={styles.sliderWrapper} ref={sliderRef}>
          <div className={styles.slider}>
            {avis.map((item) => (
              <div key={item.id} className={styles.card}>
                <p className={styles.thematique}>{item.thematique}</p>
                <p className={`${styles.texte} ${expanded[item.id] ? styles.expanded : ''}`}>
                  {item.contenu}
                </p>
                {item.contenu.length > 180 && (
                  <button className={styles.readMoreBtn} onClick={() => toggleExpand(item.id)}>
                    {expanded[item.id] ? 'Lire moins' : 'Lire plus'}
                  </button>
                )}
                <p className={styles.prenom}>— {item.prenom}</p>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.navRight} onClick={() => scroll('right')}><span className="material-icons">chevron_right</span></button>
      </div>
    </div>
  )
}
