type SanierungParams = {
    "InstandhaltungPerQM": number,
    "KfwTilgung": number,
    "KfwZinssatz": number,
    "Kontostand": number,
    "NettoBaukostenVariant1": number,
    "NettoBaukostenVariant2": number,
    "OldDKs": number,
    "SanierungsDKs": number,
    "SolidarityPercent": number,
    "SparkasseLoanAmount": number,
    "WohnraumQM": number,
}

const basisParameters: SanierungParams = {
    InstandhaltungPerQM: 10,
    KfwTilgung: 0.0333,
    KfwZinssatz: 0.0122,
    Kontostand: 110000,
    NettoBaukostenVariant1: 632199.42,
    NettoBaukostenVariant2: 1074329.74,
    OldDKs: 840000,
    SanierungsDKs: 500000,
    SolidarityPercent: 0.1,
    SparkasseLoanAmount: 1000000,
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
    getWohnraumQM() {
        return this.sanierung.WohnraumQM;
    }
    getSparkasseLoanAmount() {
        return this.sanierung.SparkasseLoanAmount;
    }
}

export const sanierung: Sanierung = new Sanierung(basisParameters);