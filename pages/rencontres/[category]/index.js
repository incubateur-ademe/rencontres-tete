import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Team from '@/components/Team'
import ProgItem from '@/components/ProgItem'
import SessionBox from '@/components/SessionBox'
import styles from '@/styles/Module.module.css'

export async function getServerSideProps(context) {
    const { category } = context.query;

    const getData = await fetch(`http://localhost:3000/api/modules/slug?slug=${category}`)
    const json = await getData.json()

    if(json.page === true){
        let data = json.data[0]
        return {
            props: { data }
        }
    }
    else{
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

}

export default function Module({ data }){

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const lastUpdate = formatDate(data.lastUpdate);

    const [sessions, setSessions] = useState([])
    const [departement, setDepartement] = useState('')

    const getSessions = async (departement) => {
        const fetcher = await fetch(`/api/sessions?id=${data.id}&departement=${departement}&status=publish`)
        const json = await fetcher.json()
        setSessions(json)
    }

    useEffect(() => {
        getSessions(departement)
    }, [departement])

    return (
        <>
            <Head>
                <title>ADEME</title>
            </Head>
            <div className={styles.Module}>
                <div className="section">
                    <div className="boxed">
                        <div className={styles.Header}>
                            <h1>{data.nom}</h1>
                            <p className={styles.Breadcrump}>
                                <Link href="/">Accueil</Link> /
                                <Link href="/rencontres">Toutes les rencontres</Link> /
                                <span>{data.nom}</span>
                            </p>
                            <span className={styles.Tag}>{data.pilier}</span>
                            <p>{data.description}</p>
                            <p>Code module : #{data.code} - Dernière mise à jour : {lastUpdate}</p>
                        </div>
                        <div className="flex gap50 mTop50">
                            <div className="w70">                                
                                <div className={styles.Content} dangerouslySetInnerHTML={{ __html: data.metasModule.resumeProgramme }}>

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
                                        <span className={styles.InfosValue}>{data.metasModule.objectifs}</span>
                                        <div className="flex aligncenter gap5">
                                            <span className={styles.InfosLabel}>Durée :</span>
                                            <span className={styles.InfosValue}>{data.metasModule.duree}</span>
                                        </div>
                                        <div className="flex aligncenter gap5">
                                            <span className={styles.InfosLabel}>Public cible :</span>
                                            <span className={styles.InfosValue}>{data.metasModule.publicCible}</span>
                                        </div>
                                        <div className="flex aligncenter gap5">
                                            <span className={styles.InfosLabel}>Tarif :</span>
                                            <span className={styles.InfosValue}>{data.metasModule.tarif}</span>
                                        </div>
                                        <div className="text-center mTop15">
                                            <Link href="#sessions" className="btn__normal btn__dark w100">Les prochaines sessions</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="mTop50">
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
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="section blued">
                <div className="boxed">
                    <h2>Découvrez le programme du module</h2>
                    <div className="flex wrap gap25 mTop40">
                        {data.metasModule.programmeModule.map((programme, index) => {
                            return (
                                <div key={index} className="w23">
                                    <ProgItem
                                        type={programme.horaires}
                                        title={programme.titre}
                                        description={programme.description}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="section" id="sessions">
                <div className="boxed">
                    <h2>Les sessions à venir</h2>
                    <div className="flex aligncenter gap10 mTop20">
                        <div className="w30">
                            <div className="select">
                                <select name="departement" value={departement} onChange={(event) => {setDepartement(event.target.value)}} className="input-select">
                                    <option value="">Sélectionnez un département</option>
                                    <option>01 - Ain</option>
                                    <option>02 - Aisne</option>
                                    <option>03 - Allier</option>
                                    <option>04 - Alpes-de-Haute-Provence</option>
                                    <option>05 - Hautes-Alpes</option>
                                    <option>06 - Alpes-Maritimes</option>
                                    <option>07 - Ardèche</option>
                                    <option>08 - Ardennes</option>
                                    <option>09 - Ariège</option>
                                    <option>10 - Aube</option>
                                    <option>11 - Aude</option>
                                    <option>12 - Aveyron</option>
                                    <option>13 - Bouches-du-Rhône</option>
                                    <option>14 - Calvados</option>
                                    <option>15 - Cantal</option>
                                    <option>16 - Charente</option>
                                    <option>17 - Charente-Maritime</option>
                                    <option>18 - Cher</option>
                                    <option>19 - Corrèze</option>
                                    <option>2A - Corse-du-Sud</option>
                                    <option>2B - Haute-Corse</option>
                                    <option>21 - Côte-d'Or</option>
                                    <option>22 - Côtes-d'Armor</option>
                                    <option>23 - Creuse</option>
                                    <option>24 - Dordogne</option>
                                    <option>25 - Doubs</option>
                                    <option>26 - Drôme</option>
                                    <option>27 - Eure</option>
                                    <option>28 - Eure-et-Loir</option>
                                    <option>29 - Finistère</option>
                                    <option>30 - Gard</option>
                                    <option>31 - Haute-Garonne</option>
                                    <option>32 - Gers</option>
                                    <option>33 - Gironde</option>
                                    <option>34 - Hérault</option>
                                    <option>35 - Ille-et-Vilaine</option>
                                    <option>36 - Indre</option>
                                    <option>37 - Indre-et-Loire</option>
                                    <option>38 - Isère</option>
                                    <option>39 - Jura</option>
                                    <option>40 - Landes</option>
                                    <option>41 - Loir-et-Cher</option>
                                    <option>42 - Loire</option>
                                    <option>43 - Haute-Loire</option>
                                    <option>44 - Loire-Atlantique</option>
                                    <option>45 - Loiret</option>
                                    <option>46 - Lot</option>
                                    <option>47 - Lot-et-Garonne</option>
                                    <option>48 - Lozère</option>
                                    <option>49 - Maine-et-Loire</option>
                                    <option>50 - Manche</option>
                                    <option>51 - Marne</option>
                                    <option>52 - Haute-Marne</option>
                                    <option>53 - Mayenne</option>
                                    <option>54 - Meurthe-et-Moselle</option>
                                    <option>55 - Meuse</option>
                                    <option>56 - Morbihan</option>
                                    <option>57 - Moselle</option>
                                    <option>58 - Nièvre</option>
                                    <option>59 - Nord</option>
                                    <option>60 - Oise</option>
                                    <option>61 - Orne</option>
                                    <option>62 - Pas-de-Calais</option>
                                    <option>63 - Puy-de-Dôme</option>
                                    <option>64 - Pyrénées-Atlantiques</option>
                                    <option>65 - Hautes-Pyrénées</option>
                                    <option>66 - Pyrénées-Orientales</option>
                                    <option>67 - Bas-Rhin</option>
                                    <option>68 - Haut-Rhin</option>
                                    <option>69 - Rhône</option>
                                    <option>70 - Haute-Saône</option>
                                    <option>71 - Saône-et-Loire</option>
                                    <option>72 - Sarthe</option>
                                    <option>73 - Savoie</option>
                                    <option>74 - Haute-Savoie</option>
                                    <option>75 - Paris</option>
                                    <option>76 - Seine-Maritime</option>
                                    <option>77 - Seine-et-Marne</option>
                                    <option>78 - Yvelines</option>
                                    <option>79 - Deux-Sèvres</option>
                                    <option>80 - Somme</option>
                                    <option>81 - Tarn</option>
                                    <option>82 - Tarn-et-Garonne</option>
                                    <option>83 - Var</option>
                                    <option>84 - Vaucluse</option>
                                    <option>85 - Vendée</option>
                                    <option>86 - Vienne</option>
                                    <option>87 - Haute-Vienne</option>
                                    <option>88 - Vosges</option>
                                    <option>89 - Yonne</option>
                                    <option>90 - Territoire de Belfort</option>
                                    <option>91 - Essonne</option>
                                    <option>92 - Hauts-de-Seine</option>
                                    <option>93 - Seine-Saint-Denis</option>
                                    <option>94 - Val-de-Marne</option>
                                    <option>95 - Val-d'Oise</option>
                                    <option>971 - Guadeloupe</option>
                                    <option>972 - Martinique</option>
                                    <option>973 - Guyane</option>
                                    <option>974 - Réunion</option>
                                    <option>976 - Mayotte</option>
                                </select>
                                <span className="material-icons">expand_more</span>
                            </div>
                        </div>
                    </div>
                    {sessions.length > 0 ? (
                    <div className="flex wrap gap15 mTop30">
                        {sessions.map((session, index) => {
                            return (
                                <div key={index} className="w32">
                                    <SessionBox 
                                        date={formatDate(session.dateDebut)}
                                        region={session.region}
                                        title={session.module.nom}
                                        link={`/rencontres/${session.module.slug}/session-${formatDate(session.dateDebut).replaceAll('/', '-')}-${session.region.normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "")
                                        .replace(/[.,]/g, "")
                                        .replace(/\s+/g, '-')
                                        .toLowerCase()}`}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    ) : (
                        <div className="mTop30">
                            <span>Aucune session disponible pour le moment.</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}