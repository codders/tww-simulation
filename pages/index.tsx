import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { Footer } from './_footer'
import { Header } from './_header'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header/>

      <main className={styles.main}>
        <div className={styles.logo}>
          <img src="/logo.jpg" />
        </div>

        <h1 className={styles.title}>
          TWW Renovierungs Simulation
        </h1>

        <div className={styles.cardGrid}>
          <Link href="/simulation">
            <a className={styles.card}>
              <p className={styles.graphSubtitle}>Launch Simulation</p>
            </a>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
