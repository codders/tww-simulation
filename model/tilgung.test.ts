import { Sanierung, SanierungParams } from "./sanierung"
import { TilgungGenerator } from "./tilgung"

const basisParameters: SanierungParams = {
    BetriebskostenVariant2: 1980,
    GasBasisPreis: 16.35,
    GasPreisEuroProkWh: 0.1065,
    GasverbrauchkWhVariant1: 90269.5,
    HausnebenkostenVariant1: 48.74,
    HausnebenkostenVariant2: 43.63,
    InstandhaltungPerQM: 10,
    KfwTilgung: 0.0333,
    KfwZinssatz: 0.0122,
    KontoPuffer: 20000,
    Kontostand: 111000,
    NettoBaukostenVariant1: 630283.46,
    NettoBaukostenVariant2: 1074329.74,
    OldDKs: 837859,
    SanierungsDKs: 500000,
    SolidarityPercent: 0.1,
    SparkasseOriginalLoanAmount: 1000000,
    SparkasseOutstandingLoanAmount: 968000,
    SparkasseTilgung: 0.0320,
    SparkasseZinssatz: 0.0085,
    StromBasisPreis: 11.26,
    StromPreisEuroProkWh: 0.5633,
    StromverbrauchkWhVariant1: 10678,
    StromverbrauchkWhVariant2: (15760 + 10678),
    WohnraumQM: 681,
}

test("annuity amount sparkasse", () => {
    expect(new TilgungGenerator(new Sanierung(basisParameters)).getSparkasseAnnuity().toFixed(2)).toBe("40500.00")
})

test("Total DKs variant 1", () => {
    const sanierung = new Sanierung(basisParameters);
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getTotalDKs(1).toFixed(2)).toBe("1496896.32")
})

test("annuity amount DKs variant 1", () => {
    const sanierung = new Sanierung(basisParameters);
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getDkAnnuity(1).toFixed(2)).toBe("19459.65")
})

test("annuity total amount variant 1", () => {
    const sanierung = new Sanierung(basisParameters);
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getTotalAnnuity(1).toFixed(2)).toBe("59959.65")
})