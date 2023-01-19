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
        "Beschreibung": "We do the minimal – Kellerdeckendämmung and Dach (inkl. Photovoltaik)",
        "Betriebskosten": 0,
        "GasverbrauchkWh": 90269.5,
        "Hausnebenkosten": 48.74,
        "NettoBaukosten": 630283.46,
        "StromverbrauchkWh": 10678,
        "Variant": 1
    },
    {
        "Beschreibung": "We do everything – Dach, Balkone, Kellerdeckendämmung, Photovoltaik, Außendämmung, Fenster / Türen und Heizung",
        "Betriebskosten": 1980,
        "GasverbrauchkWh": 0,
        "Hausnebenkosten": 43.63,
        "NettoBaukosten": 1072413.77,
        "StromverbrauchkWh": (15760 + 10678),
        "Variant": 2
    },
    {
        "Beschreibung": "We do everything, updated angebot (per 14. Dez) – Dach, Balkone, Kellerdeckendämmung, Photovoltaik, Außendämmung, Fenster / Türen und Heizung",
        "Betriebskosten": 1980,
        "GasverbrauchkWh": 0,
        "Hausnebenkosten": 43.63,
        "NettoBaukosten": 1098694.27,
        "StromverbrauchkWh": (15760 + 10678),
        "Variant": 3
    },
    {
        "Beschreibung": "We do everything, updated angebot (per 14. Dez), ohne Balkoneaufstockung – Dach, Balkone, Kellerdeckendämmung, Photovoltaik, Außendämmung, Fenster / Türen und Heizung",
        "Betriebskosten": 1980,
        "GasverbrauchkWh": 0,
        "Hausnebenkosten": 43.63,
        "NettoBaukosten": 1074405.23,
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
    Zinsen: 0.012,
}

const basisParameters: SanierungParams = {
    GasBasisPreis: 16.35,
    GasPreisEuroProkWh: 0.1065,
    InstandhaltungPerQM: 10,
    KfwTilgung: 0.0288,
    KfwZinssatz: 0.0122,
    KontoPuffer: 35000,
    Kontostand: 111000,
    OldDKs: 840000,
    SanierungsDKs: 0,
    SolidarityPercent: 0.1,
    SparkasseOriginalLoanAmount: 1000000,
    SparkasseOutstandingLoanAmount: 968000,
    SparkasseTilgung: 0.0320,
    SparkasseZinssatz: 0.0085,
    StromBasisPreis: 11.26,
    StromPreisEuroProkWh: 0.5633,
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