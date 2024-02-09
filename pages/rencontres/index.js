import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PilierBox from '@/components/PilierBox'
import ModuleBox from '@/components/ModuleBox'
import styles from '@/styles/Rencontres.module.css'

export default function Rencontres(){
    return (
        <>
            <div className={styles.Rencontres}>
                <div className="section blued">
                    <div className="boxed">
                        <h1>Découvrez toutes les rencontres à venir</h1>
                        <div className="flex space-between mTop40">
                            <div className="w32">
                            <PilierBox 
                                pic="climat-air-energie.png"
                                title="Climat Air Energie" 
                                description="Découvrez l’ensemble des rencontres disponibles pour le pilier Climat Air Energie" 
                                link="/"
                            />
                            </div>
                            <div className="w32">
                            <PilierBox 
                                pic="economie-circulaire.png"
                                title="Economie circulaire" 
                                description="Découvrez l’ensemble des rencontres disponibles pour le pilier Economie circulaire" 
                                link="/"
                            />
                            </div>
                            <div className="w32">
                            <PilierBox 
                                pic="economie-circulaire.png"
                                title="Climat Air Energie" 
                                description="Découvrez l’ensemble des rencontres disponibles pour le pilier Climat Air Energie" 
                                link="/"
                            />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="boxed">
                        <div className="flex gap50">
                            <div className="w70">
                                <h2>Tous les modules disponibles :</h2>
                                <div className="flex wrap gap15 mTop40">
                                    <div className="w32">
                                    <ModuleBox title="Planification territoriale" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Energie, eau et assainissement" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Mobilité et qualité de l'air" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Transition bas carbone" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Prévention et gestion des déchêts" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Consommation responsable" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Autres piliers de l'économie circulaire" />
                                    </div>
                                    <div className="w32">
                                    <ModuleBox title="Gouvernance et pilotage" />
                                    </div>
                                </div>
                            </div>          
                            <div className="w30">
                                <div>
                                    <span className={styles.Label}>Pilier de la transition écologique</span>
                                    <div className="select">
                                        <select className="input-select">
                                            <option>Tous les piliers</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                </div>
                                <div className="mTop40">
                                    <span className={styles.Label}>Rechercher par nom</span>
                                    <input type="text" className="input-text" placeholder="Commencez à taper..." />
                                </div>
                                <div className="mTop40">
                                    <span className={styles.Label}>Rechercher par région</span>
                                    <ul className={styles.Regions}>
                                        <li><span className="material-icons">room</span>Auvergne-Rhône-Alpes</li>
                                        <li><span className="material-icons">room</span>Bourgogne-Franche-Comté</li>
                                        <li><span className="material-icons">room</span>Bretagne</li>
                                        <li><span className="material-icons">room</span>Centre-Val de Loire</li>
                                        <li><span className="material-icons">room</span>Corse</li>
                                        <li><span className="material-icons">room</span>Normandie</li>
                                        <li><span className="material-icons">room</span>Nouvelle-Aquitaine</li>
                                        <li><span className="material-icons">room</span>Occitanie</li>
                                        <li><span className="material-icons">room</span>Grand-Est</li>
                                        <li><span className="material-icons">room</span>Hauts-de-France</li>
                                        <li><span className="material-icons">room</span>Île-de-France</li>
                                        <li><span className="material-icons">room</span>Pays de la Loire</li>
                                        <li><span className="material-icons">room</span>Provence-Alpes-Côte d'Azur</li>
                                    </ul>
                                </div>
                                <div className="mTop40">
                                    <span className={styles.Label}>Rechercher par département</span>
                                    <div className="select">
                                        <select className="input-select">
                                            <option>Tous les départements</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                </div>
                                <div className="mTop40">
                                    <span className={styles.Label}>Rechercher par thématique</span>
                                    <div className="select">
                                        <select className="input-select">
                                            <option>Toutes les thématiques</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                </div>
                                <div className="mTop40">
                                    <span className={styles.Label}>Rechercher par date</span>
                                    <div className="flex aligncenter gap10">
                                        <input type="date" className="input-date" />
                                        <input type="date" className="input-date" />
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-top border-top">
                    <div className="boxed">
                        <div className="flex">
                            <div className="w60">
                            <h2><span className="orange">Créez un compte</span> ou connectez-vous pour vous inscrire aux rencontres dans votre région.</h2>
                            <div className="flex aligncenter gap20 mTop30">
                                <Link href="/" className="btn__normal btn__dark">S'inscrire à la plateforme</Link>
                                <Link href="/" className="btn__normal btn__light">Se connecter</Link>
                            </div>
                            </div>
                            <div className="w40">
                            <img src="medias/inscription.png" class="w100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}