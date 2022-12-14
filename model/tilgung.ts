import { Sanierung } from "./sanierung";

function calculateStartAnnuity(creditSum: number, zinsen: number, tilgung: number) {
    return creditSum * (zinsen + tilgung);
}

function debtAfterNextPayment(currentDebt: number, zinsen: number, annuity: number) {
    const interest = currentDebt * zinsen;
    const payment = currentDebt < annuity ? currentDebt : annuity - interest;
    return currentDebt - payment;
}

export class TilgungGenerator {
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
    setDirektKreditZinsen(zinsen: number) {
        this.dkZinsen = zinsen / 100;
    }
    setDirektKreditTilgung(tilgung: number) {
        this.dkTilgung = tilgung / 100;
    }
    setDirektKredite(direktKredite: number) {
        this.direktKredite = direktKredite;
    }
    getTotalDKs(variant: number) {
        return this.sanierung.getExistingDirektKredite() + Math.min(this.direktKredite, this.sanierung.getUncoveredCosts(variant));
    }
    getKfwLoanSize(variant: number) {
        if (variant === 1) {
            return 0;
        }
        return Math.max(this.sanierung.getUncoveredCosts(variant) - this.direktKredite, 0);
    }
    getDkAnnuity(variant: number) {
        const dkSum = this.getTotalDKs(variant);
        return calculateStartAnnuity(dkSum, this.dkZinsen, this.dkTilgung);
    }
    getSparkasseAnnuity() {
        const sparkasseSum = this.sanierung.getSparkasseOriginalLoanAmount();
        return calculateStartAnnuity(sparkasseSum, this.sanierung.getSparkasseZinssatz(), this.sanierung.getSparkasseTilgung());
    }
    getKfwAnnuity(variant: number) {
        const kfwSum = this.getKfwLoanSize(variant);
        return calculateStartAnnuity(kfwSum, this.sanierung.getKfwZinssatz(), this.sanierung.getKfwTilgung());
    }
    getTotalAnnuity(variant: number) {
        return this.getDkAnnuity(variant)
            + this.getSparkasseAnnuity()
            + this.getKfwAnnuity(variant);
    }
    generateVariant(variant: number) {
        const dataPoints = [];
        let year = 2023;
        let dkSum = this.getTotalDKs(variant);
        let sparkasseSum = this.sanierung.getSparkasseOutstandingLoanAmount();
        let kfwSum = this.getKfwLoanSize(variant);
        while ((dkSum > 0 && this.dkTilgung > 0) || sparkasseSum > 0 || kfwSum > 0) {
            dataPoints.push({
                DirektKredite: dkSum,
                KfW: kfwSum,
                Sparkasse: sparkasseSum,
                Variant: variant,
                date: new Date(year, 1, 1)
            })
            dkSum = debtAfterNextPayment(dkSum, this.dkZinsen, this.getDkAnnuity(variant));
            kfwSum = debtAfterNextPayment(kfwSum, this.sanierung.getKfwZinssatz(), this.getKfwAnnuity(variant));
            sparkasseSum = debtAfterNextPayment(sparkasseSum, this.sanierung.getSparkasseZinssatz(), this.getSparkasseAnnuity());
            year = year + 1;
        }
        return dataPoints;
    }
}