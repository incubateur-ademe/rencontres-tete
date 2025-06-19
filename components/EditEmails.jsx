import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import beautify from 'js-beautify'
import 'react-quill/dist/quill.snow.css'
import styles from '@/styles/Admin.module.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditEmails() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [fullHtml, setFullHtml] = useState('')

  useEffect(() => {
    fetch('/api/edit-emails/list')
      .then(res => res.json())
      .then(setFiles)
  }, [])

  const loadFile = async (filename) => {
    const res = await fetch(`/api/edit-emails/load-body?filename=${filename}`)
    const data = await res.json()

    setSelectedFile(filename)
    setBodyHtml(data.bodyHtml || '')
    setFullHtml(data.fullHtml || '')
  }

  const cleanAndFormatHtml = (rawHtml) => {
    // 1. Supprimer les target/rel ajoutés par ReactQuill
    let cleaned = rawHtml
      .replace(/ rel="noopener noreferrer"/g, '')
      .replace(/ target="_blank"/g, '')
  
    // 2. Nettoyer les <strong> mal imbriqués autour des <a>
    cleaned = cleaned.replace(/<\/strong>\s*<a/g, '</strong><a')
                     .replace(/<\/a>\s*<strong>/g, '</a><strong>')
  
    // 3. Beautify (indenter correctement)
    return beautify.html(cleaned, {
      indent_size: 2,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      wrap_line_length: 120,
      end_with_newline: false
    })
  }
  

  const save = async () => {
    const cleanedHtml = cleanAndFormatHtml(bodyHtml)
  
    const res = await fetch('/api/edit-emails/save-body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: selectedFile, newBodyHtml: cleanedHtml })
    })
  
    if (res.ok) alert('Contenu mis à jour avec succès')
    else alert('Erreur lors de la sauvegarde')
  }
  

  return (
    <div>
      <div className="flex aligncenter space-between w100">
        <span className={`${styles.Title} w70`}>Modifier le contenu des e-mails</span>
      </div>

        <div className="select mTop20">
            <select className="input-select" onChange={e => loadFile(e.target.value)} value={selectedFile}>
            <option value="">-- Sélectionner un modèle de mail --</option>
            {files.map(file => (
                <option key={file.filename} value={file.filename}>
                    <strong>{file.subject}</strong> ({file.filename})
                </option>
            ))}
            </select>
            <span className="material-icons">expand_more</span>
        </div>

      {selectedFile && (
        <>
          <div className="editt" style={{ marginTop: '1rem' }}>
            <ReactQuill value={bodyHtml} onChange={setBodyHtml} theme="snow" />
          </div>

          <button onClick={save} className="btn__normal btn__dark mt-2 mTop20">Sauvegarder</button>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>🔍 Aperçu</h3>
          <iframe
            title="Aperçu"
            style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
            srcDoc={fullHtml
                .replace(
                /<div class="text">([\s\S]*?)<\/div>/,
                `<div class="text">${cleanAndFormatHtml(bodyHtml)}</div>`
                )
                .replaceAll('{{siteUrl}}', 'https://rencontres.territoiresentransitions.fr')}
            />

        </>
      )}
    </div>
  )
}
