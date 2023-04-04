import { dkReferenceWerte, Sanierung } from "./sanierung";

export class ColdCostGenerator {
    sanierung: Sanierung;
    direktKredite: number;
    dkZinsen: number;
    dkTilgung: number;
    kfwTilgungsZuschuss: number;

    constructor(sanierung: Sanierung, kfwTilgungsZuschuss: number = 0.1) {
        this.sanierung = sanierung;
        this.direktKredite = 0;
        this.dkZinsen = dkReferenceWerte.Zinsen;
        this.dkTilgung = dkReferenceWerte.Tilgung;
        this.kfwTilgungsZuschuss = kfwTilgungsZuschuss;
    }
    getKfwLoanSize(variant: number) {
        return Math.max(this.sanierung.getUncoveredCosts(variant) - this.direktKredite, 0);
    }
    getKfwZinsenPayment(variant: number) {
        if (variant === 1) {
            return 0;
        }
        /* Wir rechnung hier die Tilgungs zuschuss mit */
        return (this.getKfwLoanSize(variant) * (1 - this.kfwTilgungsZuschuss)) * this.sanierung.getKfwZinssatz();
    }
    getNettoBaukosten(variant: number) {
        return this.sanierung.getNettoBaukosten(variant);
    }
    getDkTilgungAmount(variant: number) {
        return this.getTotalDKs(variant) * this.dkTilgung;
    }
    getDkZinsenAmount(variant: number) {
        return this.getTotalDKs(variant) * this.dkZinsen;
    }
    getKfwTilgungPayment(variant: number) {
        if (variant === 1) {
            return 0;
        }
        /* Wir rechnung hier die Tilgungs zuschuss mit */
        return (this.getKfwLoanSize(variant) * (1 - this.kfwTilgungsZuschuss)) * this.sanierung.getKfwTilgung();
    }
    getSparkasseTilgungAmount() {
        return this.sanierung.getSparkasseOriginalLoanAmount() * this.sanierung.getSparkasseTilgung();
    }
    getSparkasseZinsenAmount() {
        return this.sanierung.getSparkasseOriginalLoanAmount() * this.sanierung.getSparkasseZinssatz();
    }
    getFinancingCosts(variant: number) {
        return this.getSparkasseTilgungAmount()
            + this.getSparkasseZinsenAmount()
            + this.getDkTilgungAmount(variant)
            + this.getDkZinsenAmount(variant)
            + this.getKfwTilgungPayment(variant)
            + this.getKfwZinsenPayment(variant)
    }
    getMietausfallwagnis(variant: number) {
        return (this.getFinancingCosts(variant)
            + this.sanierung.getSolidarbeitrag()
            + this.sanierung.getInstandhaltungsKosten()
            + this.sanierung.getVerwaltungsKosten()) * (1/0.97 - 1)
    }
    getTotalCosts(variant: number) {
        return this.getMietausfallwagnis(variant)
            + this.sanierung.getSolidarbeitrag()
            + this.sanierung.getInstandhaltungsKosten()
            + this.sanierung.getVerwaltungsKosten()
            + this.getFinancingCosts(variant)
    }
    getTotalDKs(variant: number) {
        return this.sanierung.getExistingDirektKredite() + Math.min(this.direktKredite, this.sanierung.getUncoveredCosts(variant));
    }
    getKaltMiete(variant: number) {
        return this.getTotalCosts(variant) / this.sanierung.getWohnraumQM() / 12;
    }
    setDirektKredite(direktKredite: number) {
        return this.direktKredite = direktKredite;
    }
    setDirektKreditZinsen(zinsen: number) {
        this.dkZinsen = zinsen / 100;
    }
    setDirektKreditTilgung(tilgung: number) {
        this.dkTilgung = tilgung / 100;
    }
    generateVariant(variant: number) {
        return ({
            "DK Tilgung": this.getDkTilgungAmount(variant).toFixed(0),
            "DK Zinsen": this.getDkZinsenAmount(variant).toFixed(0),
            "KFW Tilgung": this.getKfwTilgungPayment(variant).toFixed(0),
            "KFW Zinsen": this.getKfwZinsenPayment(variant).toFixed(0),
            "Kaltmiete": this.getKaltMiete(variant),
            "Sparkasse Tilgung": this.getSparkasseTilgungAmount().toFixed(0),
            "Sparkasse Zinsen": this.getSparkasseZinsenAmount().toFixed(0),
            "Total Costs": this.getTotalCosts(variant).toFixed(0),
            "Variant": variant,
        })
    }
    generateVariants() {
        return this.sanierung.variants.map(v => this.generateVariant(v.Variant))
    }
};
