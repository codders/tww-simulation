import { tickStep } from "d3-array";
import { Sanierung } from "../model/sanierung";

export class ColdCostGenerator
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
    getKfwLoanSize(variant: number) {
        return Math.max(this.sanierung.getUncoveredCosts(variant) - this.direktKredite, 0);
    }
    getKfwZinsenPayment(variant: number) {
        return this.getKfwLoanSize(variant) * this.sanierung.getKfwZinssatz();
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
        return this.getKfwLoanSize(variant) * this.sanierung.getKfwTilgung();
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
            + this.sanierung.getInstandhaltungsKosten()) * 0.0309
    }
    getTotalCosts(variant: number) {
        return this.getMietausfallwagnis(variant)
            + this.sanierung.getSolidarbeitrag()
            + this.sanierung.getInstandhaltungsKosten()
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
    generateVariants() {
        return [
            {
                "DK Tilgung": this.getDkTilgungAmount(1).toFixed(0),
                "DK Zinsen": this.getDkZinsenAmount(1).toFixed(0),
                "KFW Tilgung": "0",
                "KFW Zinsen": "0",
                "Kaltmiete": this.getKaltMiete(1),
                "Sparkasse Tilgung": this.getSparkasseTilgungAmount().toFixed(0),
                "Sparkasse Zinsen": this.getSparkasseZinsenAmount().toFixed(0),
                "Total Costs": this.getTotalCosts(1).toFixed(0),
                "Variant": 1,    
            },
            {
                "DK Tilgung": this.getDkTilgungAmount(2).toFixed(0),
                "DK Zinsen": this.getDkZinsenAmount(2).toFixed(0),
                "KFW Tilgung": this.getKfwTilgungPayment(2).toFixed(0),
                "KFW Zinsen": this.getKfwZinsenPayment(2).toFixed(0),
                "Kaltmiete": this.getKaltMiete(2),
                "Sparkasse Tilgung": this.getSparkasseTilgungAmount().toFixed(0),
                "Sparkasse Zinsen": this.getSparkasseZinsenAmount().toFixed(0),
                "Total Costs": this.getTotalCosts(2).toFixed(0),
                "Variant": 2,
            }        
        ]
    }
};
