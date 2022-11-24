import { Sanierung } from "../../model/sanierung";

export class CostGenerator
{
    sanierung: Sanierung;
    direktKredite: number;
    dkZinsen: number;
    dkTilgung: number;

    constructor(sanierung: Sanierung) {
        this.sanierung = sanierung;
        this.direktKredite = 0;
        this.dkZinsen = 0.008;
        this.dkTilgung = 0.005;
    }
    getInstandhaltungsKosten() {
        return this.sanierung.InstandhaltungPerQM * this.sanierung.WohnraumQM;
    }
    getSolidarbeitrag() {
        return this.sanierung.WohnraumQM * 12 * this.sanierung.SolidarityPercent;
    }
    getKfwLoanSize(variant: number) {
        return this.getBruttoBaukosten(variant) - this.sanierung.Kontostand - this.sanierung.SanierungsDKs - this.direktKredite;
    }
    getKfwZinsenPayment(variant: number) {
        return this.getKfwLoanSize(variant) * this.sanierung.KfwZinssatz;
    }
    getBruttoBaukosten(variant: number) {
        return this.getNettoBaukosten(variant) * 1.19;
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
    getDkTilgungAmount() {
        return this.getTotalDKs() * this.dkTilgung;
    }
    getDkZinsenAmount() {
        return this.getTotalDKs() * this.dkZinsen;
    }
    getKfwTilgungPayment(variant: number) {
        return this.getKfwLoanSize(variant) * this.sanierung.KfwTilgung;
    }
    getSparkasseTilgungAmount() {
        return 32000;
    }
    getSparkasseZinsenAmount() {
        return 8500;
    }
    getFinancingCosts(variant: number) {
        return this.getSparkasseTilgungAmount() 
            + this.getSparkasseZinsenAmount()
            + this.getDkTilgungAmount()
            + this.getDkZinsenAmount()
            + this.getKfwTilgungPayment(variant)
            + this.getKfwZinsenPayment(variant)
    }
    getMietausfallwagnis(variant: number) {
        return (this.getFinancingCosts(variant)
            + this.getSolidarbeitrag()
            + this.getInstandhaltungsKosten()) * 0.0309
    }
    getTotalCosts(variant: number) {
        return this.getMietausfallwagnis(variant)
            + this.getSolidarbeitrag()
            + this.getInstandhaltungsKosten()
            + this.getFinancingCosts(variant)
    }
    getExistingDirektKredite() {
        return this.sanierung.OldDKs + this.sanierung.SanierungsDKs;
    }
    getTotalDKs() {
        return this.getExistingDirektKredite() + this.direktKredite;
    }
    getMiete(variant: number) {
        return this.getTotalCosts(variant) / this.sanierung.WohnraumQM / 12;
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
    generateVariants() {
        return [
            {
                "DK Tilgung": this.getDkTilgungAmount().toFixed(0),
                "DK Zinsen": this.getDkZinsenAmount().toFixed(0),
                "KFW Tilgung": "0",
                "KFW Zinsen": "0",
                "Miete": this.getMiete(1).toFixed(2),
                "Sparkasse Tilgung": this.getSparkasseTilgungAmount().toFixed(0),
                "Sparkasse Zinsen": this.getSparkasseZinsenAmount().toFixed(0),
                "Total Costs": this.getTotalCosts(1).toFixed(0),
                "Variant": 1,    
            },
            {
                "DK Tilgung": this.getDkTilgungAmount().toFixed(0),
                "DK Zinsen": this.getDkZinsenAmount().toFixed(0),
                "KFW Tilgung": this.getKfwTilgungPayment(2).toFixed(0),
                "KFW Zinsen": this.getKfwZinsenPayment(2).toFixed(0),
                "Miete": this.getMiete(2).toFixed(2),
                "Sparkasse Tilgung": this.getSparkasseTilgungAmount().toFixed(0),
                "Sparkasse Zinsen": this.getSparkasseZinsenAmount().toFixed(0),
                "Total Costs": this.getTotalCosts(2).toFixed(0),
                "Variant": 2,
            }        
        ]
    }
};
