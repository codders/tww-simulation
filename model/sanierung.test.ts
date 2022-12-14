import { Sanierung, SanierungParams } from "./sanierung"

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

test("calculate Instandhaltungskosten", () => {
    expect(new Sanierung(basisParameters).getInstandhaltungsKosten()).toBe(6810)
})

test("calculate Solidarbeitrag", () => {
    expect(new Sanierung(basisParameters).getSolidarbeitrag()).toBe(817.2)
})

test("required DKs variant 1", () => {
    expect(new Sanierung(basisParameters).getUncoveredCosts(1).toFixed(2)).toBe("159037.32")
})

test("required DKs variant 2", () => {
    expect(new Sanierung(basisParameters).getUncoveredCosts(2).toFixed(2)).toBe("687452.39")
})