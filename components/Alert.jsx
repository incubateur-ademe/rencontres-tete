import styles from '@/styles/Alert.module.css'

export default function Alert({datas, setAlert}){
    return (
        <div className={styles.Alert}>
            <div className={styles.AlertBox}>
                <span className={`${styles.AlertIcon} material-icons`}>{datas.icon}</span>
                <span className={styles.AlertAsk}>{datas.text}</span>
                <div className="flex justicenter gap10">
                    <button onClick={datas.action} className="btn__normal btn__dark">Oui</button>
                    <button onClick={() => setAlert(null)} className="btn__normal btn__light">Non</button>
                </div>
            </div>
        </div>
    )
}