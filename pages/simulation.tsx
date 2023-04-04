import type { NextPage } from 'next'
import { useReducer } from 'react'
import { ApiConsumer } from '../components/apiContext'
import { DirektKreditSlider,
    DirektKreditTilgungSlider,
    DirektKreditZinsenSlider } from '../components/direktKredite'
import { GasPreisSlider, StromPreisSlider } from '../components/energieVersorgung'
import { KfwKreditTilgungSlider, KfwKreditZinsenSlider, KfwTilgungsSwitch } from '../components/kfwKredit'
import { dkReferenceWerte, kfwReferenceWerte, sanierung } from '../model/sanierung'
import styles from '../styles/Home.module.css'
import { Footer } from './_footer'
import Graph from './_graph'
import { Header } from './_header'
import MieteDisplay from './_miete'
import { PieChart } from './_pie'
import TilgungChart from './_tilgung'

const useStateWithMerge = (initialState: any) => useReducer(
    (state: any, update: any) => ({ ...state, ...update }),
    initialState
);

const NetAssetsProjected: NextPage = () => {
    const [apiOptions, setApiOptions] = useStateWithMerge({
        direktKreditTilgung: dkReferenceWerte.Tilgung * 100,
        direktKreditZinsen: dkReferenceWerte.Zinsen * 100,
        direktKredite: 400000,
        gasPreisCentskWh: sanierung.getGasPreisEuroProkWh() * 100,
        kfwKreditTilgung: kfwReferenceWerte.Tilgung * 100,
        kfwKreditZinsen: kfwReferenceWerte.Zinsen * 100,
        kfwTilgungInclusive: true,
        stromPreisCentskWh: sanierung.getStromPreisEuroProkWh() * 100,
        url: "/api/simulate",
        variant: 4
    })
    const urlForOptions = (options: any) => {
        const { url, ...queryOptions } = options;
        return url + "?" + new URLSearchParams(queryOptions)
    }

    return (
        <ApiConsumer value={{ apiOptions, updateApiOptions: setApiOptions }}>
            <div className={styles.container}>
                <Header />

                <main className={styles.main} style={{ paddingTop: "0px" }}>
                    <div>
                        <MieteDisplay dataSource={urlForOptions(apiOptions)} />
                    </div>

                    <div className={styles.grid}>
                        <div>
                            <h1 style={{ width: '100%', margin: '0px', textAlign: 'center' }}>Annual Costs</h1>
                            <Graph width="700" height="600" dataSource={urlForOptions(apiOptions)} />
                        </div>
                        <div>
                            <h1 style={{ width: '100%', margin: '0px', textAlign: 'center' }}>Total Debt Variant {apiOptions.variant}</h1>
                            <PieChart width="700" height="600" dataSource={urlForOptions(apiOptions)} />
                        </div>
                    </div>

                    <div style={{ width: '100%' }}>
                        <h2 style={{ width: '100%', margin: '0px', textAlign: 'center' }}>Tilgung Variant {apiOptions.variant}</h2>
                        <TilgungChart width="1400" height="100" dataSource={urlForOptions(apiOptions)} />
                    </div>

                    <div className={styles.sliderGrid}>
                        <div>
                            <DirektKreditSlider />
                        </div>
                        <div>
                            <DirektKreditZinsenSlider />
                        </div>
                        <div>
                            <DirektKreditTilgungSlider />
                        </div>
                        <div>
                            <KfwKreditZinsenSlider />
                        </div>
                        <div>
                            <KfwKreditTilgungSlider />
                        </div>
                        <div>
                            <KfwTilgungsSwitch />
                        </div>
                        <div>
                            <StromPreisSlider />
                        </div>
                        <div>
                            <GasPreisSlider />
                        </div>
                    </div>

                </main>
                <Footer />
            </div>
        </ApiConsumer>
    )
}

export default NetAssetsProjected