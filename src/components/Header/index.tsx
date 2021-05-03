import styles from './styles/header.module.scss'
import img from '../../../public/image/header.png'

export default function Header() {

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <img src={img} alt="logo" />
        </div>
      </header>
    </>
  )
}
