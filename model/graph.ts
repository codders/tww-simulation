export type GraphData<T> = {
    name: string,
    series: T
}

export type AnnualCost = {
    'Sparkasse Tilgung': string;
    'Sparkasse Zinsen': string;
    'KFW Tilgung': string;
    'KFW Zinsen': string;
    'DK Tilgung': string;
    'DK Zinsen': string;
    'Miete': string;
    'Total Costs': string;
    'Variant': number;
}

export type DebtCollection = {
    DirektKredite: number,
    Kfw: number,
    Sparkasse: number,
    Variant: number
}

export type AnnualCostSeries = {
    annualCosts: AnnualCost[],
    debts: DebtCollection[],
    tilgung: TilgungDataPointWithVariant[],
}

export type TilgungDataPoint = {
    DirektKredite: number,
    KfW: number,
    Sparkasse: number,
    date: Date
}

export type TilgungDataPointWithVariant =  TilgungDataPoint & {
    Variant: number
}
