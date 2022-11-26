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
        <h1 className={styles.title}>
          TWW Miete und Schulden Simulation
        </h1>

        <div className={styles.grid}>
          <Link href="/simulation">
            <a className={styles.card}>
              <p className={styles.graphSubtitle}>Simulation</p>
            </a>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
