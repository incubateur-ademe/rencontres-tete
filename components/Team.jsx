import styles from '@/styles/Module.module.css'
import Link from 'next/link'

export default function Team({img, name, description, linkedin}){
    return (
        <>
            <div className="flex gap20 aligncenter">
                <div className={styles.TeamPic}>
                    <img src={img} alt="team" />
                </div>
                <div className="w70">
                    <span className={styles.TeamName}>{name}</span>
                    <span className={styles.TeamDesc}>{description}</span>
                    {linkedin != null && (
                        <Link href={linkedin} rel="noreferer noopener"><img src="/linkedin.png" className={styles.linkedin} /></Link>
                    )}
                </div>
            </div>
        </>
    )
}