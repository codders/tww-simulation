export type SanierungParams = {
    "GasBasisPreis": number,
    "GasPreisEuroProkWh": number,
    "InstandhaltungPerQM": number,
    "KfwTilgung": number,
    "KfwZinssatz": number,
    "Kontostand": number,
    "KontoPuffer": number,
    "OldDKs": number,
    "SanierungsDKs": number,
    "SolidarityPercent": number,
    "SparkasseOriginalLoanAmount": number,
    "SparkasseOutstandingLoanAmount": number,
    "SparkasseTilgung": number,
    "SparkasseZinssatz": number,
    "StromPreisEuroProkWh": number,
    "StromBasisPreis": number,
    "VerwaltungsKostenEurProQM": number,
    "WohnraumQM": number,
}

export type Bauvariant = {
    "Beschreibung": string,
    "Betriebskosten": number,
    "GasverbrauchkWh": number,
    "Hausnebenkosten": number,
    "NettoBaukosten": number,
    "StromverbrauchkWh": number,
    "Variant": number,
}

export const variants: Bauvariant[] = [
    {
        "Beschreibung": "Komplett Sanierung (per 29. März Angebot)",
        "Betriebskosten": 1980,
        "GasverbrauchkWh": 0,
        "Hausnebenkosten": 43.63,
        "NettoBaukosten": 1266129.5,
        "StromverbrauchkWh": (15760 + 10678),
        "Variant": 4
    },
]

export type Finanzierung = {
    "Zinsen": number,
    "Tilgung": number
}

export const dkReferenceWerte: Finanzierung = {
    Tilgung: 0.003,
    Zinsen: 0.010,
}

export const basisParameters: SanierungParams = {
    GasBasisPreis: 16.35,
    GasPreisEuroProkWh: 0.1065,
    InstandhaltungPerQM: 10,
    KfwTilgung: 0.0288,
    KfwZinssatz: 0.0113,
    KontoPuffer: 35000,
    Kontostand: 76217.93, // 312217.93
    OldDKs: 804467.93,
    SanierungsDKs: 0,
    SolidarityPercent: 0.1,
    SparkasseOriginalLoanAmount: 1000000,
    SparkasseOutstandingLoanAmount: 968000,
    SparkasseTilgung: 0.0320,
    SparkasseZinssatz: 0.0085,
    StromBasisPreis: 11.26,
    StromPreisEuroProkWh: 0.4500,
    VerwaltungsKostenEurProQM: 3,
    WohnraumQM: 681,
}

export class Sanierung {
    sanierung: SanierungParams
    variants: Bauvariant[]

    constructor(sanierungParams: SanierungParams, bauvariants: Bauvariant[]) {
        this.sanierung = sanierungParams;
        this.variants = bauvariants;
    }
    getDescription(variant: number) {
        return this.getVariant(variant).Beschreibung;
    }
    getVariant(variant: number) {
        const found = this.variants.find(v => v.Variant === variant);
        if (found !== undefined) {
            return found;
        }
        throw new Error("Invalid Variant " + variant);
    }
    getInstandhaltungsKosten() {
        return this.sanierung.InstandhaltungPerQM * this.sanierung.WohnraumQM;
    }
    getVerwaltungsKosten() {
        return this.sanierung.VerwaltungsKostenEurProQM * this.sanierung.WohnraumQM;
    }
    getSolidarbeitrag() {
        return this.sanierung.WohnraumQM * 12 * this.sanierung.SolidarityPercent;
    }
    getNettoBaukosten(variant: number) {
        return this.getVariant(variant).NettoBaukosten;
    }
    getBruttoBaukosten(variant: number) {
        return this.getNettoBaukosten(variant) * 1.19;
    }
    getExistingDirektKredite() {
        return this.sanierung.OldDKs + this.sanierung.SanierungsDKs;
    }
    getUncoveredCosts(variant: number) {
        return this.getBruttoBaukosten(variant)
            - this.sanierung.Kontostand
            - this.sanierung.SanierungsDKs
            + this.sanierung.KontoPuffer;
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
    getBetriebskostenProQMProMonat(variant: number) {
        return this.getVariant(variant).Betriebskosten / (this.sanierung.WohnraumQM * 12);
    }
    getGasBasisPreisProQMProMonat() {
        return this.sanierung.GasBasisPreis * 8 / this.sanierung.WohnraumQM;
    }
    getGasPreisEuroProkWh() {
        return this.sanierung.GasPreisEuroProkWh;
    }
    getGasverbrauchkWhProQMProMonat(variant: number) {
        return this.getVariant(variant).GasverbrauchkWh / (this.sanierung.WohnraumQM * 12);
    }
    getHausnebenkostenProQMProMonat(variant: number) {
        return this.getVariant(variant).Hausnebenkosten * 30 / this.sanierung.WohnraumQM;
    }
    getStromBasisPreisProQMProMonat() {
        return this.sanierung.StromBasisPreis / this.sanierung.WohnraumQM;
    }
    getStromPreisEuroProkWh() {
        return this.sanierung.StromPreisEuroProkWh;
    }
    getStromverbrauchkWhProQMProMonat(variant: number) {
        return this.getVariant(variant).StromverbrauchkWh / (this.sanierung.WohnraumQM * 12);
    }
}

export const sanierung: Sanierung = new Sanierung(basisParameters, variants);
