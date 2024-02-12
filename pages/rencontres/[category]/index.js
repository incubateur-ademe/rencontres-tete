import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Team from '@/components/Team'
import ProgItem from '@/components/ProgItem'
import SessionBox from '@/components/SessionBox'
import styles from '@/styles/Module.module.css'

export default function Module(){

    const router = useRouter();
    const { category } = router.query;
  
    return (
        <>
            <Head>
                <title>ADEME | Energie, eau et assainissement</title>
            </Head>
            <div className={styles.Module}>
                <div className="section">
                    <div className="boxed">
                        <div className={styles.Header}>
                            <h1>Énergie, eau et assainissement</h1>
                            <p className={styles.Breadcrump}>
                                <Link href="/">Accueil</Link> /
                                <Link href="/rencontres">Toutes les rencontres</Link> /
                                <span>Énergie, eau et assainissement</span>
                            </p>
                            <span className={styles.Tag}>Énergie, eau et assainissement</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris eget risus laoreet maximus. Nulla facilisi. Nulla suscipit iaculis diam, ac ultricies mauris fringilla at. Pellentesque neque nunc, dapibus in mollis in, vulputate dictum dolor. Pellentesque augue orci, volutpat eget suscipit ac, interdum eu libero. Vestibulum arcu lectus, rutrum sit amet vestibulum quis, ornare id nibh. Aenean vehicula, nulla eget malesuada laoreet, tellus lacus blandit lectus, nec tincidunt quam mi eu felis nec tincidunt quam mi eu felis nec tincidunt quam mi eu felis nec tincidunt quam mi eu felis.</p>
                            <p>Code module : #123456 - Dernière mise à jour : 06/02/2024</p>
                        </div>
                        <div className="flex gap50 mTop50">
                            <div className="w70">                                
                                <div className={styles.Content}>
                                    <h2>Comment optimiser les coûts en énergie sans modigier les actions de votre entreprise</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris eget risus laoreet maximus. Nulla facilisi. Nulla <strong>suscipit iaculis diam</strong>, ac ultricies mauris fringilla at. Pellentesque neque nunc, dapibus in mollis in, vulputate dictum dolor. Pellentesque augue orci, volutpat eget suscipit ac, interdum eu libero.</p>
                                    <h3>Les intérêts communs d'une transition réussite</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris eget risus <strong>laoreet maximus</strong>. Nulla facilisi. Nulla suscipit iaculis diam, ac ultricies mauris fringilla at. Pellentesque neque nunc, dapibus in mollis in, <strong>vulputate dictum dolor</strong>. Pellentesque augue orci, volutpat eget suscipit ac, interdum eu libero.</p>
                                    <h3>Quels sont les moyens à mettre en place sur court-terme ?</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris eget risus laoreet maximus. Nulla facilisi. Nulla suscipit iaculis diam, ac <strong>ultricies mauris fringilla</strong> at. Pellentesque neque nunc, dapibus in mollis in, vulputate dictum dolor. Pellentesque augue orci, volutpat eget suscipit ac, <strong>interdum eu libero</strong>.</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris eget risus <strong>laoreet maximus</strong>. Nulla facilisi. Nulla suscipit iaculis diam, ac ultricies mauris fringilla at. Pellentesque neque nunc, dapibus in mollis in, <strong>vulputate dictum dolor</strong>. Pellentesque augue orci, volutpat eget suscipit ac, interdum eu libero.</p>
                                </div>
                            </div>
                            <div className="w30">
                                <div className="text-center">
                                    <img src="/medias/infos-cles.png" alt="infos clés" className="w50" />
                                </div>
                                <div className={styles.Infos}>
                                    <span>Informations clés</span>
                                    <div className={styles.InfosContent}>
                                        <span className={styles.InfosLabel}>Objectifs :</span>
                                        <span className={styles.InfosValue}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel mauris.</span>
                                        <div className="flex aligncenter gap5">
                                            <span className={styles.InfosLabel}>Durée :</span>
                                            <span className={styles.InfosValue}>4h</span>
                                        </div>
                                        <div className="flex aligncenter gap5">
                                            <span className={styles.InfosLabel}>Public cible :</span>
                                            <span className={styles.InfosValue}>Dirigeants</span>
                                        </div>
                                        <div className="flex aligncenter gap5">
                                            <span className={styles.InfosLabel}>Tarif :</span>
                                            <span className={styles.InfosValue}>Gratuit</span>
                                        </div>
                                        <div className="text-center mTop15">
                                            <Link href="/" className="btn__normal btn__dark w100">Les prochaines sessions</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mTop50">
                            <h2>Équipe pédagogique</h2>
                            <div className="flex wrap gap25 mTop40">
                                <div className="w32">
                                    <Team
                                        img="/medias/user.png"
                                        name="Personne A"
                                        description="Descriptif du poste de la personne A"
                                    />
                                </div>
                                <div className="w32">
                                    <Team
                                        img="/medias/user.png"
                                        name="Personne B"
                                        description="Descriptif du poste de la personne B"
                                    />
                                </div>
                                <div className="w32">
                                    <Team
                                        img="/medias/user.png"
                                        name="Personne C"
                                        description="Descriptif du poste de la personne C"
                                    />
                                </div>
                                <div className="w32">
                                    <Team
                                        img="/medias/user.png"
                                        name="Personne D"
                                        description="Descriptif du poste de la personne D"
                                    />
                                </div>
                                <div className="w32">
                                    <Team
                                        img="/medias/user.png"
                                        name="Personne E"
                                        description="Descriptif du poste de la personne E"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section blued">
                <div className="boxed">
                    <h2>Découvrez le programme du module</h2>
                    <div className="flex wrap gap25 mTop40">
                        <div className="w23">
                            <ProgItem
                                type="Séquence 1"
                                title="Café d'arrivée et mise en place des participants"
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar justo nec."
                            />
                        </div>
                        <div className="w23">
                            <ProgItem
                                type="Séquence 2"
                                title="Café d'arrivée et mise en place des participants"
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar justo nec."
                            />
                        </div>
                        <div className="w23">
                            <ProgItem
                                type="Séquence 3"
                                title="Café d'arrivée et mise en place des participants"
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar justo nec."
                            />
                        </div>
                        <div className="w23">
                            <ProgItem
                                type="Séquence 4"
                                title="Café d'arrivée et mise en place des participants"
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar justo nec."
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="boxed">
                    <h2>Les sessions à venir</h2>
                    <div className="flex aligncenter gap10 mTop20">
                        <div className="w30">
                            <div className="select">
                                <select className="input-select">
                                    <option>Sélectionnez un département</option>
                                </select>
                                <span className="material-icons">expand_more</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex wrap gap15 mTop30">
                        <div className="w32">
                            <SessionBox 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                link="/rencontres/energie-eau-assainissement/session-21-02-2024"
                            />
                        </div>
                        <div className="w32">
                            <SessionBox 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                link="/"
                            />
                        </div>
                        <div className="w32">
                            <SessionBox 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                link="/"
                            />
                        </div>
                        <div className="w32">
                            <SessionBox 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                link="/"
                            />
                        </div>
                        <div className="w32">
                            <SessionBox 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                link="/"
                            />
                        </div>
                        <div className="w32">
                            <SessionBox 
                                date="21/02/2024"
                                region="Grand Est"
                                title="Énergie, eau et assainissement"
                                link="/"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}