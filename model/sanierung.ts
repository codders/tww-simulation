type SanierungParams = {
    "BetriebskostenVariant2": number,
    "GasBasisPreis": number,
    "GasverbrauchkWhVariant1": number,
    "GasPreisEuroProkWh": number,
    "HausnebenkostenVariant1": number,
    "HausnebenkostenVariant2": number,
    "InstandhaltungPerQM": number,
    "KfwTilgung": number,
    "KfwZinssatz": number,
    "Kontostand": number,
    "NettoBaukostenVariant1": number,
    "NettoBaukostenVariant2": number,
    "OldDKs": number,
    "SanierungsDKs": number,
    "SolidarityPercent": number,
    "SparkasseOriginalLoanAmount": number,
    "SparkasseOutstandingLoanAmount": number,
    "SparkasseTilgung": number,
    "SparkasseZinssatz": number,
    "StromverbrauchkWhVariant1": number,
    "StromverbrauchkWhVariant2": number,
    "StromPreisEuroProkWh": number,
    "StromBasisPreis": number,
    "WohnraumQM": number,
}

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
    Kontostand: 110000,
    NettoBaukostenVariant1: 632199.42,
    NettoBaukostenVariant2: 1074329.74,
    OldDKs: 840000,
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

export class Sanierung {
    sanierung: SanierungParams
    constructor(sanierungParams: SanierungParams) {
        this.sanierung = sanierungParams;
    }
    getInstandhaltungsKosten() {
        return this.sanierung.InstandhaltungPerQM * this.sanierung.WohnraumQM;
    }
    getSolidarbeitrag() {
        return this.sanierung.WohnraumQM * 12 * this.sanierung.SolidarityPercent;
    }
    getNettoBaukosten(variant: number) {
        if (variant === 1) {
            return this.sanierung.NettoBaukostenVariant1;
        }
        if (variant === 2) {
            return this.sanierung.NettoBaukostenVariant2;
        }
        throw new Error("Invalid Variant")
    }
    getBruttoBaukosten(variant: number) {
        return this.getNettoBaukosten(variant) * 1.19;
    }
    getExistingDirektKredite() {
        return this.sanierung.OldDKs + this.sanierung.SanierungsDKs;
    }
    getUncoveredCosts(variant: number) {
        return this.getBruttoBaukosten(variant) - this.sanierung.Kontostand - this.sanierung.SanierungsDKs;
    }
    getKfwZinssatz() {
        return this.sanierung.KfwZinssatz;
    }
    getKfwTilgung() {
        return this.sanierung.KfwTilgung;
    }
    getSparkasseZinssatz() {
        return this.sanierung.SparkasseZinssatz;
    }
    getSparkasseTilgung() {
        return this.sanierung.SparkasseTilgung;
    }
    getWohnraumQM() {
        return this.sanierung.WohnraumQM;
    }
    getSparkasseOriginalLoanAmount() {
        return this.sanierung.SparkasseOriginalLoanAmount;
    }
    getSparkasseOutstandingLoanAmount() {
        return this.sanierung.SparkasseOutstandingLoanAmount;
    }
    getBetriebskostenProQMProMonatVariant2() {
        return this.sanierung.BetriebskostenVariant2 / (this.sanierung.WohnraumQM * 12);
    }
    getGasBasisPreisProQMProMonat() {
        return this.sanierung.GasBasisPreis * 8 / this.sanierung.WohnraumQM;
    }
    getGasPreisEuroProkWh() {
        return this.sanierung.GasPreisEuroProkWh;
    }
    getGasverbrauchkWhProQMProMonatVariant1() {
        return this.sanierung.GasverbrauchkWhVariant1 / (this.sanierung.WohnraumQM * 12);
    }
    getHausnebenkostenProQMProMonatVariant1() {
        return this.sanierung.HausnebenkostenVariant1 * 30 / this.sanierung.WohnraumQM;
    }
    getHausnebenkostenProQMProMonatVariant2() {
        return this.sanierung.HausnebenkostenVariant2 * 30 / this.sanierung.WohnraumQM;
    }
    getStromBasisPreisProQMProMonat() {
        return this.sanierung.StromBasisPreis / this.sanierung.WohnraumQM;
    }
    getStromPreisEuroProkWh() {
        return this.sanierung.StromPreisEuroProkWh;
    }
    getStromverbrauchkWhProQMProMonatVariant1() {
        return this.sanierung.StromverbrauchkWhVariant1 / (this.sanierung.WohnraumQM * 12);
    }
    getStromverbrauchkWhProQMProMonatVariant2() {
        return this.sanierung.StromverbrauchkWhVariant2 / (this.sanierung.WohnraumQM * 12);
    }
}

export const sanierung: Sanierung = new Sanierung(basisParameters);