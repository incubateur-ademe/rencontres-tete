import Head from 'next/head'
import Link from 'next/link'
import prisma from '@/prisma';
import { useState, useEffect } from 'react'
import SessionBox from '@/components/SessionBox';
import ModuleBox from '@/components/ModuleBox'
import styles from '@/styles/Rencontres.module.css'

export async function getServerSideProps(context) {
  const { query } = context;
  const { pilier, nom, region, departement, thematique } = query;

  // Construction du whereClause pour filtrer
  const whereClause = {
    status: 'publish',
    ...(region && { region: { contains: region, mode: 'insensitive' } }),
    ...(departement && { departement }),
    module: {
      ...(pilier && { pilier }),
      ...(thematique && { thematique }),
      ...(nom && { nom: { contains: nom, mode: 'insensitive' } }),
    },
  };

  // Récupération de TOUTES les sessions (passées et futures)
  const sessions = await prisma.session.findMany({
    where: whereClause,
    include: {
      module: {
        include: {
          metasModule: true,
        },
      },
      metasSession: true,
    },
    orderBy: [
      { dateDebut: 'asc' }, // tri croissant : les futures en premier
    ],
  });

  // Sérialisation des dates pour éviter les erreurs de format côté client
  const serializedSessions = sessions.map((session) => {
    const safeSession = { ...session };
    const safeModule = { ...session.module };

    if (safeSession.dateDebut instanceof Date)
      safeSession.dateDebut = safeSession.dateDebut.toISOString();
    if (safeSession.datePublication instanceof Date)
      safeSession.datePublication = safeSession.datePublication.toISOString();
    if (safeSession.lastUpdate instanceof Date)
      safeSession.lastUpdate = safeSession.lastUpdate.toISOString();

    if (safeModule.datePublication instanceof Date)
      safeModule.datePublication = safeModule.datePublication.toISOString();
    if (safeModule.lastUpdate instanceof Date)
      safeModule.lastUpdate = safeModule.lastUpdate.toISOString();

    return {
      ...safeSession,
      module: safeModule,
    };
  });

  return {
    props: {
      sessions: serializedSessions,
      region: region || '',
      pilier: pilier || '',
      thematique: thematique || '',
    },
  };
}
  

export default function Rencontres({ sessions, region, pilier, thematique }) {
  const [displaySessions, setDisplaySessions] = useState(sessions);
  const [filtres, setFiltres] = useState({ pilier, nom: '', region, departement: '', thematique, dateDebut: '' });

  const now = new Date();
  const upcomingSessions = displaySessions
  .filter(s => new Date(s.dateDebut) >= now)
  .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));

  const pastSessions = displaySessions
  .filter(s => new Date(s.dateDebut) < now)
  .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));

  const [view, setView] = useState('upcoming');

  const [email, setEmail] = useState('');
  const [regionSelected, setRegionSelected] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFilteredSessions = async () => {
      let url = `/api/sessions?status=publish&passed=${view}&`;
      if (filtres.pilier) url += `pilier=${encodeURIComponent(filtres.pilier)}&`;
      if (filtres.nom) url += `nom=${encodeURIComponent(filtres.nom)}&`;
      if (filtres.region) url += `region=${encodeURIComponent(filtres.region)}&`;
      if (filtres.departement) url += `departement=${encodeURIComponent(filtres.departement)}&`;
      if (filtres.thematique) url += `thematique=${encodeURIComponent(filtres.thematique)}&`;
      if (filtres.dateDebut) url += `dateDebut=${encodeURIComponent(filtres.dateDebut)}&`;
  
      const res = await fetch(url);
      const data = await res.json();
      setDisplaySessions(data);
    };
  
    fetchFilteredSessions();
  }, [filtres, view]);
  

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  const handleSubmitAlert = async (e) => {
    e.preventDefault();
  
    if (!email || !regionSelected) {
      setMessage("Merci de remplir tous les champs.");
      return;
    }
  
    try {
      const res = await fetch('/api/alertes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, region: regionSelected }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setMessage("✅ Alerte activée avec succès !");
        setEmail('');
        setRegionSelected('');
      } else {
        setMessage(data.error || "❌ Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de se connecter au serveur.");
    }
  };
  

  return (
    <>
      <Head>
        <title>Les rencontres | ADEME</title>
      </Head>
      <div className={styles.Rencontres}>
        <div className="section blued">
          <div className="boxed">
            <h1>Les sessions à venir dans votre région</h1>
          </div>
        </div>

        <div className="section">
          <div className="boxed">
            <div className="flex toColumn gap50">
              <div className="w70 wm100">
              <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', width: '100%' }} className="w100 mBot20">
              <span>
                Vous souhaitez être informé des prochaines Rencontres dans votre Région ?
                Activez l’alerte mail ci-dessous :
              </span>
              <form onSubmit={handleSubmitAlert} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex gap10 toColumn">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w50 wm100 input-text"
                    required
                  />

                  <div className="select w50 wm100">
                  <select className="wm100 input-select" value={regionSelected} onChange={(e) => setRegionSelected(e.target.value)} required>
                    <option value="">Sélectionnez votre région</option>
                    <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                      <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
                      <option value="Bretagne">Bretagne</option>
                      <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                      <option value="Corse">Corse</option>
                      <option value="Normandie">Normandie</option>
                      <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                      <option value="Occitanie">Occitanie</option>
                      <option value="Grand-Est">Grand-Est</option>
                      <option value="Hauts-de-France">Hauts-de-France</option>
                      <option value="Île-de-France">Île-de-France</option>
                      <option value="Pays de la Loire">Pays de la Loire</option>
                      <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                      <option value="Guadeloupe">Guadeloupe</option>
                      <option value="Martinique">Martinique</option>
                      <option value="Guyane">Guyane</option>
                      <option value="Polynésie Française">Polynésie Française</option>
                      <option value="Saint-Pierre et Miquelon">Saint-Pierre et Miquelon</option>
                      <option value="Océan Indien">Océan Indien</option>
                      <option value="Nouvelle Calédonie">Nouvelle Calédonie</option>
                  </select>
                    <span className="material-icons">expand_more</span>
                  </div>
                  <button className="btn__normal btn__dark" type="submit">Activer</button>
                </div>
                {message && <p style={{ marginTop: '10px', marginBottom: '0px' }}>{message}</p>}
              </form>
            </div>
            <div className="flex gap10 mBot20">
              <button
                onClick={() => setView('upcoming')}
                className={`btn__normal ${view === 'upcoming' ? 'btn__dark' : 'btn__light'}`}
              >
                Sessions à venir
              </button>
              <button
                onClick={() => setView('past')}
                className={`btn__normal ${view === 'past' ? 'btn__dark' : 'btn__light'}`}
              >
                Sessions passées
              </button>
            </div>

            {(view === 'upcoming' ? upcomingSessions : pastSessions).length > 0 ? (
              <div className="flex wrap gap15">
                {(view === 'upcoming' ? upcomingSessions : pastSessions).map((session, index) => (
                  <div key={index} className="w100 wm100" style={view === 'past' ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                    <SessionBox 
                      date={formatDate(session.dateDebut)}
                      region={session.region}
                      title={session.module.nom}
                      link={view === 'past' ? '' : `/rencontres/${session.module.slug}/session-${formatDate(session.dateDebut).replaceAll('/', '-')}-${session.region.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,']/g, "").replace(/\s+/g, '-').toLowerCase()}`}
                      dept={session.departement}
                      displayDept="no"
                      moduleDuree={session.module.metasModule.duree}
                      model="full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mTop20">
                <span>Aucune session {view === 'upcoming' ? 'à venir' : 'passée'} avec les filtres activés.</span>
              </div>
            )}

              </div>
              <div className="w30 wm100">
                <div>
                  <span className={styles.Label}>Rechercher par axe de la transition écologique</span>
                  <div className="select">
                    <select name="pilier" value={filtres.pilier} onChange={(e) => setFiltres(prev => ({ ...prev, pilier: e.target.value }))} className="input-select">
                      <option value="">Tous les axes</option>
                      <option>Climat Air Energie</option>
                      <option>Economie circulaire</option>
                      <option>Approche transversale</option>
                    </select>
                    <span className="material-icons">expand_more</span>
                  </div>
                </div>

                <div className="mTop40">
                  <span className={styles.Label}>Rechercher par thématique</span>
                  <div className="select">
                    <select name="thematique" value={filtres.thematique} onChange={(e) => setFiltres(prev => ({ ...prev, thematique: e.target.value }))} className="input-select">
                      <option value="">Toutes les thématiques</option>
                      <option>Planification territoriale</option>
                      <option>Energie, eau et assainissement</option>
                      <option>Mobilité et qualité de l'air</option>
                      <option>Transition bas carbone</option>
                      <option>Prévention et gestion des déchets</option>
                      <option>Consommation responsable</option>
                      <option>Autres piliers de l'économie circulaire</option>
                      <option>Gouvernance et pilotage</option>
                    </select>
                    <span className="material-icons">expand_more</span>
                  </div>
                </div>

                <div className="mTop40">
                  <span className={styles.Label}>Rechercher par nom</span>
                  <input name="nom" value={filtres.nom} onChange={(e) => setFiltres(prev => ({ ...prev, nom: e.target.value }))} type="text" className="input-text" placeholder="Commencez à taper..." />
                </div>

                <div className="mTop40">
                  <span className={styles.Label}>Rechercher par région</span>
                  <select className={styles.RegionsSelect} value={filtres.region} onChange={(e) => setFiltres(prev => ({ ...prev, region: e.target.value }))}>
                    <option value="">Sélectionner une région</option>
                    <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                    <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
                    <option value="Bretagne">Bretagne</option>
                    <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                    <option value="Corse">Corse</option>
                    <option value="Normandie">Normandie</option>
                    <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                    <option value="Occitanie">Occitanie</option>
                    <option value="Grand-Est">Grand-Est</option>
                    <option value="Hauts-de-France">Hauts-de-France</option>
                    <option value="Île-de-France">Île-de-France</option>
                    <option value="Pays de la Loire">Pays de la Loire</option>
                    <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                    <option value="Guadeloupe">Guadeloupe</option>
                    <option value="Martinique">Martinique</option>
                    <option value="Guyane">Guyane</option>
                    <option value="Polynésie Française">Polynésie Française</option>
                    <option value="Saint-Pierre et Miquelon">Saint-Pierre et Miquelon</option>
                    <option value="Océan Indien">Océan Indien</option>
                    <option value="Nouvelle Calédonie">Nouvelle Calédonie</option>
                  </select>
                </div>

                {/* <div className="mTop40">
                  <span className={styles.Label}>Rechercher par date de début</span>
                  <input name="dateDebut" value={filtres.dateDebut} onChange={(e) => setFiltres(prev => ({ ...prev, dateDebut: e.target.value }))} type="date" className="input-date" />
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="section-top border-top">
          <div className="boxed">
            <div className="flex toColumn">
              <div className="w60 wm100">
                <h2><span className="orange">Créez un compte</span> ou connectez-vous pour vous inscrire aux rencontres dans votre région.</h2>
                <div className="flex aligncenter toColumn gap20 mTop30 mmLeft">
                  <Link href="/inscription" className="btn__normal btn__dark">S'inscrire à la plateforme</Link>
                  <Link href="/connexion" className="btn__normal btn__light">Se connecter</Link>
                </div>
              </div>
              <div className="w40 wm100">
                <img src="medias/inscription.webp" className="w100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}