import { cloneVariants, updateVariant } from "../util/helper"
import { Bauvariant, Sanierung, SanierungParams } from "./sanierung";

export const variants20230119: Bauvariant[] = [
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

export const variants20221214 = cloneVariants(variants20230119);
updateVariant(variants20221214, 1, { NettoBaukosten: 630283.46 })
updateVariant(variants20221214, 2, { NettoBaukosten: 1074329.74 })

export const basisParametersBase: SanierungParams = {
    GasBasisPreis: 16.35,
    GasPreisEuroProkWh: 0.1065,
    InstandhaltungPerQM: 10,
    // KfwTilgung: 0.0288,
    // KfwZinssatz: 0.0149,
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
    StromPreisEuroProkWh: 0.4500,
    VerwaltungsKostenEurProQM: 0,
    WohnraumQM: 681,
}

export const basisParameters20221214: SanierungParams = Object.assign({}, basisParametersBase, {
    // KfwTilgung: 0.0333,
    // KfwZinssatz: 0.0122,
    KontoPuffer: 20000,
    OldDKs: 837859,
    StromPreisEuroProkWh: 0.5633,
});

export const basisParameters20230119: SanierungParams = Object.assign({}, basisParametersBase, {
    // KfwZinssatz: 0.0122,
    StromPreisEuroProkWh: 0.5633,
});

export const sanierung20230119 = new Sanierung(basisParameters20230119, variants20230119);
export const sanierung20221214 = new Sanierung(basisParameters20221214, variants20221214);
