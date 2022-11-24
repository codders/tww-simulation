export type Sanierung = {
    "InstandhaltungPerQM": number,
    "KfwTilgung": number,
    "KfwZinssatz": number,
    "Kontostand": number,
    "NettoBaukostenVariant1": number,
    "NettoBaukostenVariant2": number,
    "OldDKs": number,
    "SanierungsDKs": number,
    "SolidarityPercent": number,
    "WohnraumQM": number,
}

export const sanierung: Sanierung = {
    InstandhaltungPerQM: 10,
    KfwTilgung: 0.0333,
    KfwZinssatz: 0.0122,
    Kontostand: 110000,
    NettoBaukostenVariant1: 632199.42,
    NettoBaukostenVariant2: 1074329.74,
    OldDKs: 840000,
    SanierungsDKs: 500000,
    SolidarityPercent: 0.1,
    WohnraumQM: 681,
}