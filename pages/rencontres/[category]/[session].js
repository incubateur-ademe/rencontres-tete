import Link from 'next/link'
import Head from 'next/head'
import Team from '@/components/Team'
import ProgItem from '@/components/ProgItem'
import Alert from '@/components/Alert'
import { Notif } from '@/components/Notif'
import { useState, useEffect } from 'react'
import nextCookies from 'next-cookies';
import { verifyToken } from '@/utils/auth';
import styles from '@/styles/Session.module.css'

export async function getServerSideProps(context) {
    const { category, session } = context.query;

    const { auth: token } = nextCookies(context);
    const user = verifyToken(token);
  
    if (!user) {
      return {
        redirect: {
          destination: '/connexion',
          permanent: false,
        },
      };
    }

    const getData = await fetch(`http://localhost:3000/api/sessions/slug?module_slug=${category}&session=${session}`)
    const json = await getData.json()

    if(json.length > 0){
        let data = json[0]
        return {
            props: { data, user }
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

export default function Session({ data, user }){

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const [alert, setAlert] = useState(null)
    const [notif, setNotif] = useState(null)
    const [check, setCheck] = useState(false)
    const [inscriptionPasse, setInscriptionPasse] = useState(false)
    const [dispo, setDispo] = useState(true)

    const [inscription, setInscription] = useState({
        userId: '',
        civilite: '',
        nom: '',
        prenom: '',
        mail: '',
        structure: '',
        fonction: '',
        type_fonction: '',
        ville: '',
        pays: '',
        telephone: '',
        transport: '',
        besoins: '',
        hebergement: '',
        repas: false,
        covoit: false,
        rgpd: false
    })

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target
        setInscription(prev => {
            return {
                ...prev,
                [name]: type == 'checkbox' ? checked : (value == 'false' ? false : value == 'true' ? true : value)
            }
        })
    }

    const registerUser = async () => {
        let inscriptionData = {
            civilite: inscription.civilite,
            mail: inscription.mail,
            nom: inscription.nom,
            prenom: inscription.prenom,
            structure: inscription.structure,
            fonction: inscription.fonction,
            typeFonction: inscription.type_fonction,
            ville: inscription.ville,
            pays: inscription.pays,
            telephone: inscription.telephone,
            transport: inscription.transport,
            repas: inscription.repas,
            covoit: inscription.covoit
        }

        const registering = await fetch('/api/registrations/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inscriptionData: inscriptionData,
                userId: inscription.userId,
                sessionId: data.id
            })
        })

        const json = await registering.json()

        setCheck(true)

        setAlert(null)
        setNotif({
            text: 'Votre inscription a bien été prise en compte !',
            icon: 'done'
        }) 
        setInscription({
            userId: '',
            civilite: '',
            nom: '',
            prenom: '',
            mail: '',
            structure: '',
            fonction: '',
            type_fonction: '',
            ville: '',
            pays: '',
            telephone: '',
            transport: '',
            besoins: '',
            hebergement: '',
            repas: false,
            covoit: false,
            rgpd: false
        })
    }

    const register = async () => {
        const { civilite, nom, prenom, mail, structure, fonction, type_fonction, ville, pays, telephone, transport, besoins, hebergement, repas, covoit, rgpd } = inscription
        if(civilite && nom && prenom && mail && structure && fonction && type_fonction && pays && transport && hebergement){
            if(rgpd){
                if(mail.includes('@') && mail.includes('.')){
                    setAlert({
                        icon: 'warning',
                        text: 'Êtes-vous sûr de vouloir participer à cette session ?',
                        // Supposons que `action` sera appelé si l'utilisateur confirme
                        action: () => registerUser()
                    })
                }
                else{
                    setNotif({
                        text: 'Verifiez votre adresse e-mail',
                        icon: 'close'
                    })                        
                }
            }
            else{
                setNotif({
                    text: 'Veuillez accepter les conditions d\'utilisation',
                    icon: 'close'
                })                
            }
        }
        else{
            setNotif({
                text: 'Veuillez remplir tous les champs',
                icon: 'close'
            })
        }
    }

    const getAvailable = async () => {
        const fetcher = await fetch(`/api/registrations/bySession?sessionId=${data.id}`)
        const json = await fetcher.json()
        const max = parseInt(data.metasSession.nombrePlaces)
        if(json.length >= max){
            setDispo(false)
        }
    }

    useEffect(() => {
        const getUserInfo = async () => {
            const fetcher = await fetch(`/api/users/${user.id}`)
            const json = await fetcher.json()
            let userDetail = await json[0]
            setInscription(prev => {
                return {
                    ...prev,
                    userId: userDetail.id,
                    nom: userDetail.nom,
                    prenom: userDetail.prenom,
                    mail: userDetail.mail,
                    telephone: userDetail.telephone,
                    fonction:userDetail.fonction
                }
            })
        }
        getUserInfo()

    }, [])

    useEffect(() => {
        const checker = async () => {
            const fetcher = await fetch(`/api/registrations/byUserSession?userId=${user.id}&sessionId=${data.id}`)
            const json = await fetcher.json()
            if(json.length > 0){
                setCheck(true)
            }
        }
        checker()
    }, [data, alert])

    useEffect(() => {
        const maintenant = new Date();
        const dateLimite = new Date(data.metasSession.dateLimiteInscription);

        getAvailable()
    
        if (dateLimite < maintenant) {
          setInscriptionPasse(true);
        } else {
          setInscriptionPasse(false);
        }
      }, [data]);

    return (
        <>
            <Head>
                <title>{data.module.nom} | Session du {formatDate(data.dateDebut)} - {data.region}</title>
            </Head>
            <div className={styles.Session}>
                <div className="section">
                    <div className="boxed">
                        <div className={styles.Header}>
                            <h1>{formatDate(data.dateDebut)} : {data.module.nom}</h1>
                            <p className={styles.Breadcrump}>
                                <Link href="/">Accueil</Link> /
                                <Link href="/rencontres">Toutes les rencontres</Link> /
                                <Link href={`/rencontres/${data.module.slug}`}>{data.module.nom}</Link> /
                                <span>Rencontre du {formatDate(data.dateDebut)}</span>
                            </p>
                            <div className="flex aligncenter gap10">
                                <span className={styles.Region}>{data.departement+' - '+data.region}</span>
                                <span className={styles.Tag}>{data.module.nom}</span>
                            </div>                            
                            <p>{data.module.description}</p>
                            <p>Code module : #{data.module.code} - Dernière mise à jour : {formatDate(data.lastUpdate)}</p>
                        </div>
                        <div className="flex alignstart gap40 mTop40">
                            <div className={`w70 ${styles.Box}`}>
                                {check ? (
                                    <div className={styles.Already}>
                                        <span className="material-icons">done</span>
                                        <div>Vous participez à cette rencontre ! Retrouvez tous les informations sur la rencontre "{data.module.nom}" directement dans votre <Link href="/espace-personnel">espace personnel</Link>.</div>
                                    </div>
                                ) : (
                                    <>
                                        {inscriptionPasse ? (
                                            <div className={styles.Already}>
                                                <span className="material-icons">error_outline</span>
                                                <div><strong>Date limite d'inscription atteinte.</strong> Les inscriptions sont fermées pour cette session !</div>
                                            </div>
                                        ) : (
                                            <>
                                                {!dispo && (
                                                    <div className={styles.Already}>
                                                        <span className="material-icons">error_outline</span>
                                                        <div><strong>Il ne reste plus de place pour cette session.</strong> Les inscriptions sont fermées.</div>
                                                    </div>                                                    
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                                <span className={styles.Title}>Inscription à la rencontre</span>
                                <div className={styles.Form}>
                                    <div className="flex gap15 mTop20">
                                        <div className="select w20">
                                            <select name="civilite" onChange={handleChange} value={inscription.civilite} className="input-select">
                                                <option>Civilité</option>
                                                <option>Monsieur</option>
                                                <option>Madame</option>
                                                <option>Ne se prononce pas</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                        <input name="nom" onChange={handleChange} value={inscription.nom} type="text" className="input-text w50" placeholder="Nom*" />
                                        <input name="prenom" onChange={handleChange} value={inscription.prenom} type="text" className="input-text w50" placeholder="Prénom*" />
                                    </div>
                                    <div className="flex gap15 mTop20">
                                        <input type="mail" name="mail" onChange={handleChange} value={inscription.mail} className="input-mail w50" placeholder="Adresse email professionnelle*" />
                                        <div className="select w50">
                                            <select name="structure" onChange={handleChange} value={inscription.structure} className="input-select">
                                                <option>Structure / Organisme</option>
                                                <option>Collectivité territoriale</option>
                                                <option>Bureau d'études ou de conseil</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="flex gap15 mTop20">
                                        <input name="fonction" onChange={handleChange} value={inscription.fonction} type="text" className="input-text w50" placeholder="Fonction" />
                                        <div className="select w50">
                                            <select name="type_fonction" onChange={handleChange} value={inscription.type_fonction} className="input-select">
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
                                        <input name="ville" onChange={handleChange} value={inscription.ville} type="text" className="input-text w50" placeholder="Ville de résidence" />
                                        <div className="select w50">
                                            <select name="pays" onChange={handleChange} value={inscription.pays} className="input-select">
                                                <option>Pays</option>
                                                <option>France</option>
                                            </select>
                                            <span className="material-icons">expand_more</span>
                                        </div>
                                        <input name="telephone" onChange={handleChange} value={inscription.telephone} type="text" className="input-text" placeholder="Numéro de téléphone" />
                                    </div>
                                    <span className={styles.Title}>Collecte de données pour le calcul du bilan carbone</span>
                                    <div className="select w100 mTop20 mBot20">
                                        <select name="transport" onChange={handleChange} value={inscription.transport} className="input-select">
                                            <option>Mode de transport principal pour vous rendre à l'événement :*</option>
                                            <option>Bus</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                    <input type="text" className="input-text" placeholder="Avez-vous des besoins spécifiques pour accéder au lieu de la rencontre ?" />
                                    <div className="select w100 mTop20 mBot30">
                                        <select name="hebergement" onChange={handleChange} value={inscription.hebergement} className="input-select">
                                            <option>Votre type d'hébergement*</option>
                                            <option>Hôtel</option>
                                        </select>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                    <span className={styles.Title}>Informations complémentaires</span>
                                    <p>Afin de vous accueillir dans les meilleures conditions, précisez-nous vos besoins (accès PMR, handicaps...). Ces informations resteront confidentielles.</p>                                   
                                    <div className="flex gap50 mBot30">
                                        <div className="w50">
                                            <span className={styles.Title}>Souhaitez-vous déjeuner sur place ?</span>
                                            <div className="flex aligncenter gap10 mTop10">
                                                <input name="repas" onChange={handleChange} value="true" type="radio" /> Oui
                                                <input name="repas" onChange={handleChange} value="false" type="radio" /> Non
                                            </div>
                                        </div>
                                        <div className="w50">
                                            <span className={styles.Title}>Souhaitez-vous covoiturer ?</span>
                                            <div className="flex aligncenter gap10 mTop10">
                                                <input name="covoit" onChange={handleChange} value="true" type="radio" /> Oui
                                                <input name="covoit" onChange={handleChange} value="false" type="radio" /> Non
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mBot30">
                                        <div className="checkbox">
                                            <input name="rgpd" onChange={handleChange} value={inscription.rgpd} type="checkbox" /> <span>J’ai lu et j’accepte que l’ADEME collecte mes données afin de garantir la bonne utilisation des services offerts*et reconnais avoir pris connaissance de sa politique de protection des données personnelles.</span>
                                        </div>
                                    </div>
                                    {(!check && !inscriptionPasse && dispo) && (
                                        <div className="flex alignright">
                                            <button onClick={register} className="btn__normal btn__dark">
                                                Valider mon inscription
                                            </button>
                                        </div>
                                    )}
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
                                            <span className={styles.dValue}>{formatDate(data.metasSession.dateHoraires)}</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-date.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Date limite d'inscription :</span>
                                            <span className={styles.dValue}>{formatDate(data.metasSession.dateLimiteInscription)}</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-lieu.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Lieu de la rencontre :</span>
                                            <span className={styles.dValue}>{data.metasSession.lieuRencontre}</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-places.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Nombre de places :</span>
                                            <span className={styles.dValue}>{data.metasSession.nombrePlaces}</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-transport.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Pour venir :</span>
                                            <span className={styles.dValue}>{data.metasSession.infosTransport}</span>
                                        </div>
                                    </div>
                                    <div className="flex alignstart gap10 mTop20">
                                        <div className="w10">
                                            <img src="/medias/icon-infos.png" alt="icon" className="w70" />
                                        </div>
                                        <div className="w80">
                                            <span className={styles.dLabel}>Infos complémentaires :</span>
                                            <span className={styles.dValue}>{data.metasSession.infosComplementaires}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="boxed">
                    <h2>Équipe pédagogique</h2>
                    {data.metasSession.intervenants.length > 0 ? (
                        <div className="flex wrap gap25 mTop40">
                            {data.metasSession.intervenants.map((inter, index) => {
                                return (
                                    <div key={index} className="w32">
                                        <Team
                                            img="/medias/user.png"
                                            name={inter.nom}
                                            description={inter.fonction}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="mTop40">
                            <span>À venir.</span>
                        </div>                        
                    )}
                </div>
            </div>
            <div className="section blued">
                <div className="boxed">
                    <h2>Découvrez le programme de la session</h2>
                    {data.metasSession.intervenants.length > 0 ? (
                    <div className="flex wrap gap25 mTop40">
                        {data.metasSession.programmeSession.map((programme, index) => {
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
                    ):(
                        <div className="mTop40">
                            <span>À venir.</span>
                        </div>       
                    )}
                </div>
            </div>

            {alert != null && (
                <Alert datas={alert} setAlert={setAlert} />
            )}  
            {notif != null && (
                <Notif datas={notif} setNotif={setNotif} />
            )}
        </>
    )
}