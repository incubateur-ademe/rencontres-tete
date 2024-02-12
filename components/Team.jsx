import styles from '@/styles/Module.module.css'

export default function Team({img, name, description}){
    return (
        <>
            <div className="flex gap20 aligncenter">
                <div className={styles.TeamPic}>
                    <img src={img} alt="team" />
                </div>
                <div className="w70">
                    <span className={styles.TeamName}>{name}</span>
                    <span className={styles.TeamDesc}>{description}</span>
                </div>
            </div>
        </>
    )
}