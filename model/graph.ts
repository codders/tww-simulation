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

export type AnnualCostSeries = {
    annualCosts: AnnualCost[]
}
