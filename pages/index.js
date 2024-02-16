import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PilierBox from '@/components/PilierBox'
import styles from '@/styles/Home.module.css'
import ModuleBox from '@/components/ModuleBox'

export default function Home() {

  const [region, setRegion] = useState("")
  const [search, setSearch] = useState('')
  const [finds, setFinds] = useState([])

  const getModules = async (nom) => {
    const fetcher = await fetch(`/api/modules/?nom=${nom}`)
    const json = await fetcher.json()
    setFinds(json)
  }

  useEffect(() => {
    getModules(search)
  }, [search])

  return (
    <div className={styles.Home}>
      <Head>
        <title>Les Rencontres des Territoires Engagés</title>
      </Head>
      <div className="section">
        <div className="boxed">
          <div className="flex aligncenter gap50 toColumn">
            <div className="w50 wm100">
              <h1>Les Rencontres des Territoires Engagés</h1>
              <p>Participez aux Rencontres Territoire Engagé de l'ADEME organisées partout en France et montez en compétence sur les thématiques Climat Air Energie et Economie Circulaire, pour mettre en œuvre la transition écologique sur votre territoire.</p>
              <div className={styles.Searching}>
                <input name="search" value={search} onChange={(event) => setSearch(event.target.value)} className="input-text mTop30" type="text" placeholder="Rechercher un module par nom..." />
                {(finds.length > 0 && search.length > 0) && (
                  <ul>
                    {finds.slice(0, 5).map((item, index) => {
                      return <li><Link href={`/rencontres/${item.slug}`}>{item.nom}</Link></li>
                    })}
                  </ul>
                )}
              </div>              
              <Link className="link mTop30" href="/rencontres">Voir toutes les rencontres à venir →</Link>
            </div>
            <div className="w50 wm100">
              <img src="/medias/Meeting.png" alt="les rencontres des territoires engagés" className="w100" />
            </div>
          </div>
        </div>
      </div>
      <div className="section border-top">
        <div className="boxed">
          <div className="flex gap50 aligncenter toColumn">
            <div className="w50 noM">
              <div className="map__image">
                <img src="/medias/map/france.png" className="france" />
                <img src="/medias/map/FR-COR.png" onClick={() => window.location.href = `/rencontres?region=Corse`} onMouseOver={() => setRegion('COR')} onMouseOut={() => setRegion('')} className={`map corse ${region == "COR" && styles.RegionLight}`} />
                <img src="/medias/map/FR-HDF.png" onClick={() => window.location.href = `/rencontres?region=Hauts-de-France`} onMouseOver={() => setRegion('HDF')} onMouseOut={() => setRegion('')} className={`map haut-de-france ${region == "HDF" && styles.RegionLight}`} />
                <img src="/medias/map/FR-GES.png" onClick={() => window.location.href = `/rencontres?region=Grand-Est`} onMouseOver={() => setRegion('GES')} onMouseOut={() => setRegion('')} className={`map grand-est ${region == "GES" && styles.RegionLight}`} />
                <img src="/medias/map/FR-NOR.png" onClick={() => window.location.href = `/rencontres?region=Normandie`} onMouseOver={() => setRegion('NOR')} onMouseOut={() => setRegion('')} className={`map normandie ${region == "NOR" && styles.RegionLight}`} />
                <img src="/medias/map/FR-IDF.png" onClick={() => window.location.href = `/rencontres?region=Île-de-France`} onMouseOver={() => setRegion('IDF')} onMouseOut={() => setRegion('')} className={`map ile-de-france ${region == "IDF" && styles.RegionLight}`} />
                <img src="/medias/map/FR-BFC.png" onClick={() => window.location.href = `/rencontres?region=Bourgogne-Franche-Comté`} onMouseOver={() => setRegion('BFC')} onMouseOut={() => setRegion('')} className={`map bourgogne ${region == "BFC" && styles.RegionLight}`} />
                <img src="/medias/map/FR-ARA.png" onClick={() => window.location.href = `/rencontres?region=Auvergne-Rhône-Alpes`} onMouseOver={() => setRegion('ARA')} onMouseOut={() => setRegion('')} className={`map auvergne ${region == "ARA" && styles.RegionLight}`} />
                <img src="/medias/map/FR-PAC.png" onClick={() => window.location.href = `/rencontres?region=Provence-Alpes-Côte d'Azur`} onMouseOver={() => setRegion('PAC')} onMouseOut={() => setRegion('')} className={`map provence ${region == "PAC" && styles.RegionLight}`} />
                <img src="/medias/map/FR-OCC.png" onClick={() => window.location.href = `/rencontres?region=Occitanie`} onMouseOver={() => setRegion('OCC')} onMouseOut={() => setRegion('')} className={`map occitanie ${region == "OCC" && styles.RegionLight}`} />
                <img src="/medias/map/FR-NAQ.png" onClick={() => window.location.href = `/rencontres?region=Nouvelle-Aquitaine`} onMouseOver={() => setRegion('NAQ')} onMouseOut={() => setRegion('')} className={`map nouvelle-aquitaine ${region == "NAQ" && styles.RegionLight}`} />
                <img src="/medias/map/FR-CVL.png" onClick={() => window.location.href = `/rencontres?region=Centre-Val de Loire`} onMouseOver={() => setRegion('CVL')} onMouseOut={() => setRegion('')} className={`map centre ${region == "CVL" && styles.RegionLight}`} />
                <img src="/medias/map/FR-PDL.png" onClick={() => window.location.href = `/rencontres?region=Pays de la Loire`} onMouseOver={() => setRegion('PDL')} onMouseOut={() => setRegion('')} className={`map loire ${region == "PDL" && styles.RegionLight}`} />
                <img src="/medias/map/FR-BRE.png" onClick={() => window.location.href = `/rencontres?region=Bretagne`} onMouseOver={() => setRegion('BRE')} onMouseOut={() => setRegion('')} className={`map bretagne ${region == "BRE" && styles.RegionLight}`} />
              </div>
            </div>
            <div className="w50 wm100">
              <h2>Découvrez les rencontres à venir dans votre région</h2>
              <ul className={`${styles.Regions}`}>
                <li><Link href={`/rencontres?region=Auvergne-Rhône-Alpes`} onMouseOver={() => setRegion('ARA')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Auvergne-Rhône-Alpes</Link></li>
                <li><Link href={`/rencontres?region=Bourgogne-Franche-Comté`} onMouseOver={() => setRegion('BFC')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Bourgogne-Franche-Comté</Link></li>
                <li><Link href={`/rencontres?region=Bretagne`} onMouseOver={() => setRegion('BRE')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Bretagne</Link></li>
                <li><Link href={`/rencontres?region=Centre-Val de Loire`} onMouseOver={() => setRegion('CVL')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Centre-Val de Loire</Link></li>
                <li><Link href={`/rencontres?region=Corse`} onMouseOver={() => setRegion('COR')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Corse</Link></li>
                <li><Link href={`/rencontres?region=Normandie`} onMouseOver={() => setRegion('NOR')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Normandie</Link></li>
                <li><Link href={`/rencontres?region=Nouvelle-Aquitaine`} onMouseOver={() => setRegion('NAQ')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Nouvelle-Aquitaine</Link></li>
                <li><Link href={`/rencontres?region=Occitanie`} onMouseOver={() => setRegion('OCC')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Occitanie</Link></li>
                <li><Link href={`/rencontres?region=Grand-Est`} onMouseOver={() => setRegion('GES')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Grand-Est</Link></li>
                <li><Link href={`/rencontres?region=Hauts-de-France`} onMouseOver={() => setRegion('HDF')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Hauts-de-France</Link></li>
                <li><Link href={`/rencontres?region=Île-de-France`} onMouseOver={() => setRegion('IDF')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Île-de-France</Link></li>
                <li><Link href={`/rencontres?region=Pays de la Loire`} onMouseOver={() => setRegion('PDL')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Pays de la Loire</Link></li>
                <li><Link href={`/rencontres?region=Provence-Alpes-Côte d'Azur`} onMouseOver={() => setRegion('PAC')} onMouseOut={() => setRegion('')}><span className="material-icons">room</span>Provence-Alpes-Côte d'Azur</Link></li>
              </ul>
              <Link href="/rencontres" className="btn__normal btn__dark">Voir toutes les rencontres</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="section blued">
        <div className="boxed">
          <h2>Découvrez toutes les rencontres</h2>
          <div className="flex space-between mTop40 toColumn">
            <div className="w32 wm100 mmBot20">
              <PilierBox 
                pic="climat-air-energie.png"
                title="Climat Air Energie" 
                description="Découvrez l’ensemble des rencontres disponibles pour le pilier Climat Air Energie" 
                link="/rencontres?pilier=Climat Air Energie"
              />
            </div>
            <div className="w32 wm100 mmBot20">
              <PilierBox 
                pic="economie-circulaire.png"
                title="Economie circulaire" 
                description="Découvrez l’ensemble des rencontres disponibles pour le pilier Economie circulaire" 
                link="/rencontres?pilier=Economie circulaire"
              />
            </div>
            <div className="w32 wm100">
              <PilierBox 
                pic="economie-circulaire.png"
                title="Transversal" 
                description="Découvrez l’ensemble des rencontres disponibles pour le pilier Transversal" 
                link="/rencontres?pilier=Transversal"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="boxed">
          <h2>Découvrez toutes les thématiques abordées</h2>
          <div className="flex wrap gap15 mTop40">
          <div className="w24 wm47">
          <ModuleBox 
              title="Planification territoriale" 
              link="/rencontres/?thematique=Planification territoriale"
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Energie, eau et assainissement" 
              link="/rencontres/?thematique=Energie, eau et assainissement"
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Mobilité et qualité de l'air"
              link="/rencontres/?thematique=Mobilié et qualité de l'air"    
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Transition bas carbone" 
              link="/rencontres/?thematique=Transition bas carbone"    
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Prévention et gestion des déchêts" 
              link="/rencontres/?thematique=Prévention et gestion des d'échêts"
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Consommation responsable" 
              link="/rencontres/?thematique=Consommation responsable"    
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Autres piliers de l'économie circulaire" 
              link="/rencontres/?thematique=Autres piliers de l'économie circulaire"    
          />
          </div>
          <div className="w24 wm47">
          <ModuleBox 
              title="Gouvernance et pilotage" 
              link="/rencontres/?thematique=Gouvernance et pilotage"    
          />
          </div>
          </div>
        </div>
      </div>
      <div className="section-top border-top">
        <div className="boxed">
          <div className="flex toColumn">
            <div className="w60 wm100">
              <h2><span className="orange">Créez un compte</span> ou connectez-vous pour vous inscrire aux rencontres dans votre région.</h2>
              <div className="flex aligncenter gap20 mTop30 toColumn mmLeft">
                <Link href="/inscription" className="btn__normal btn__dark">S'inscrire à la plateforme</Link>
                <Link href="/connexion" className="btn__normal btn__light">Se connecter</Link>
              </div>
            </div>
            <div className="w40 wm100">
              <img src="medias/inscription.png" className="w100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
