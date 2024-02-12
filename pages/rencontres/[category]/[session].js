import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/Session.module.css'

export default function Session(){
    return (
        <>
            <div className={styles.Session}>
                <div className="section">
                    <div className="boxed">
                        <div className={styles.Header}>
                            <h1>21/02/2024 : Énergie, eau et assainissement</h1>
                            <p className={styles.Breadcrump}>
                                <Link href="/">Accueil</Link> /
                                <Link href="/rencontres">Toutes les rencontres</Link> /
                                <Link href="/rencontres/energie-eau-assainissement">Énergie, eau et assainissement</Link> /
                                <span>Rencontre du 21/02/2024</span>
                            </p>
                            <div className="flex aligncenter gap10">
                                <span className={styles.Region}>Grand Est</span>
                                <span className={styles.Tag}>Énergie, eau et assainissement</span>
                            </div>                            
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris eget risus laoreet maximus. Nulla facilisi. Nulla suscipit iaculis diam, ac ultricies mauris fringilla at. Pellentesque neque nunc, dapibus in mollis in, vulputate dictum dolor. Pellentesque augue orci, volutpat eget suscipit ac, interdum eu libero. Vestibulum arcu lectus, rutrum sit amet vestibulum quis, ornare id nibh. Aenean vehicula, nulla eget malesuada laoreet, tellus lacus blandit lectus, nec tincidunt quam mi eu felis nec tincidunt quam mi eu felis nec tincidunt quam mi eu felis nec tincidunt quam mi eu felis.</p>
                            <p>Code module : #123456 - Dernière mise à jour : 06/02/2024</p>
                        </div>
                        <div className="flex alignstart gap40 mTop40">
                            <div className={`w70 ${styles.Box}`}>
                                <span className={styles.Title}>Inscription à la rencontre</span>
                                <div className={styles.Form}>
                                    <div className="flex gap15 mTop20">
                                        <div className="select w20">
                                            <select className="input-select">
                                                <option>Civilité</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                        <input type="text" className="input-text w50" placeholder="Nom*" />
                                        <input type="text" className="input-text w50" placeholder="Prénom*" />
                                    </div>
                                    <div className="flex gap15 mTop20">
                                        <input type="text" className="input-mail w50" placeholder="Adresse email professionnelle*" />
                                        <div className="select w50">
                                            <select className="input-select">
                                                <option>Structure / Organisme</option>
                                                <option>Collectivité territoriale</option>
                                                <option>Bureau d'études ou de conseil</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="flex gap15 mTop20">
                                        <input type="text" className="input-text w50" placeholder="Fonction" />
                                        <div className="select w50">
                                            <select className="input-select">
                                                <option>Type de fonction</option>
                                                <option>Chargé.e de mission</option>
                                                <option>Directeur.rice ou chef.fe</option>
                                                <option>Elu.e</option>
                                                <option>Conseiller.ère</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="flex gap15 mTop20 mBot30">
                                        <input type="text" className="input-text w50" placeholder="Ville de résidence" />
                                        <div className="select w50">
                                            <select className="input-select">
                                                <option>Pays</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                        <input type="text" className="input-text" placeholder="Numéro de téléphone" />
                                    </div>
                                    <span className={styles.Title}>Collecte de données pour le calcul du bilan carbone</span>
                                    <div className="select w100 mTop20 mBot20">
                                        <select className="input-select">
                                            <option>Mode de transport principal pour vous rendre à l'événement :*</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                    <input type="text" className="input-text" placeholder="Avez-vous des besoins spécifiques pour accéder au lieu de la rencontre ?" />
                                    <div className="select w100 mTop20 mBot30">
                                        <select className="input-select">
                                            <option>Votre type d'hébergement*</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                    <span className={styles.Title}>Informations complémentaires</span>
                                    <p>Afin de vous accueillir dans les meilleures conditions, précisez-nous vos besoins (accès PMR, handicaps...). Ces informations resteront confidentielles.</p>                                   
                                    <div className="flex gap50 mBot30">
                                        <div className="w50">
                                            <span className={styles.Title}>Souhaitez-vous déjeuner sur place ?</span>
                                            <div className="flex aligncenter gap10 mTop10">
                                                <input type="radio" /> Oui
                                                <input type="radio" /> Non
                                            </div>
                                        </div>
                                        <div className="w50">
                                            <span className={styles.Title}>Souhaitez-vous covoiturer ?</span>
                                            <div className="flex aligncenter gap10 mTop10">
                                                <input type="radio" /> Oui
                                                <input type="radio" /> Non
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mBot30">
                                        <div className="checkbox mBot20">
                                            <input type="checkbox" /> <span>J’accepte de recevoir des actualités de l’ADEME. Vous pourrez vous désabonner à tout moment via le lien de désinscription en bas de nos e-mails.</span>
                                        </div>
                                        <div className="checkbox">
                                            <input type="checkbox" /> <span>J’ai lu et j’accepte que l’ADEME collecte mes données afin de garantir la bonne utilisation des services offerts*et reconnais avoir pris connaissance de sa politique de protection des données personnelles.</span>
                                        </div>
                                    </div>
                                    <div className="flex alignright">
                                        <button className="btn__normal btn__dark">
                                            Valider mon inscription
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w30">
                                <div className={styles.Box}>
                                    <span className={styles.Title}>Détails pratiques</span>
                                    <div className="flex alignstart gap10 mTop30">
                                        <div className="w10">
                                            <img src="/medias/icon-date.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Date et horaires :</span>
                                            <span className={styles.dValue}>21/02/2024 à 9h00</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-date.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Date limite d'inscription :</span>
                                            <span className={styles.dValue}>21/02/2024 à 9h00</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-lieu.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Lieu de la rencontre :</span>
                                            <span className={styles.dValue}>2 Passage de l'Hôtel de ville, 68100 MULHOUSE</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-places.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Nombre de places :</span>
                                            <span className={styles.dValue}>50 personnes</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-transport.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Pour venir :</span>
                                            <span className={styles.dValue}>Bus, Tram, Vélo</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-infos.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Infos complémentaires :</span>
                                            <span className={styles.dValue}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar justo nec lorem viverra imperdiet.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.Box} mTop40`}>
                                    <span className={styles.Title}>Accès rapide</span>
                                    <div className="mTop20">
                                        <Link href="/" className="btn__normal btn__dark w100 text-center">Se connecter</Link>
                                        <Link href="/" className="btn__normal btn__orange w100 text-center mTop10">Créer un compte</Link>
                                        <Link href="/" className="btn__normal btn__light w100 text-center mTop10">Retourner au module</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}