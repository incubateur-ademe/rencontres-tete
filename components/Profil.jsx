import { useState, useEffect } from 'react'
import styles from '@/styles/Account.module.css'

export default function Profil(){
    return (
        <div className={styles.Profil}>
            <span className={styles.Title}>Vos informations personnelles</span>
            <div className="mTop30">
                <div className="flex gap20">
                    <input type="text" className="input-text w50" placeholder="Nom" />
                    <input type="text" className="input-text w50" placeholder="Prénom" />
                </div>
                <div className="flex gap20 mTop20">
                    <input type="text" className="input-mail w50" placeholder="Adresse e-mail" />
                    <input type="text" className="input-text w50" placeholder="Numéro de téléphone" />
                </div>
            </div>
            <span className={styles.Subtitle}>Vous souhaitez modifier votre mot de passe ?</span>
            <div className="mTop30">
                <div className="flex gap20">
                    <input type="text" className="input-text w50" placeholder="Nouveau mot de passe" />
                    <input type="text" className="input-text w50" placeholder="Confirmez votre mot de passe*" />
                </div>
                <div className="flex alignright mTop20">
                    <button className="btn__normal btn__dark">Enregistrer les informations</button>
                </div>
            </div>
            <div className={styles.DeleteAccount}>
                <span className={styles.Subtitle}>Vous souhaitez supprimer votre compte ?</span>
                <div className="checkbox mTop30">
                    <input type="checkbox" /> <span>J’ai lu et j’accepte que l’ADEME collecte mes données afin de garantir la bonne utilisation des services offerts* et reconnais avoir pris connaissance de sa politique de protection des données personnelles.</span>
                </div>
                <div className="flex mTop20">
                    <button className="btn__normal btn__dark">Supprimer mon compte</button>
                </div>
            </div>
        </div>
    )
}