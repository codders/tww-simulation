import { Sanierung } from "../../model/sanierung";

export class DebtGenerator
{
    sanierung: Sanierung;
    direktKredite: number;

    constructor(sanierung: Sanierung) {
        this.sanierung = sanierung;
        this.direktKredite = 0;
    }
    getKfwLoanSize(variant: number) {
        return Math.max(this.sanierung.getUncoveredCosts(variant) - this.direktKredite, 0);
    }
    getTotalDKs(variant: number) {
        return this.sanierung.getExistingDirektKredite() + Math.min(this.direktKredite, this.sanierung.getUncoveredCosts(variant));
    }
    setDirektKredite(direktKredite: number) {
        return this.direktKredite = direktKredite;
    }
    generateVariants() {
        return [
            {
                "DirektKredite": this.getTotalDKs(1),
                "Kfw": this.getKfwLoanSize(1),
                "Sparkasse": this.sanierung.getSparkasseLoanAmount(),
                "Variant": 1,    
            },
            {
                "DirektKredite": this.getTotalDKs(2),
                "Kfw": this.getKfwLoanSize(2),
                "Sparkasse": this.sanierung.getSparkasseLoanAmount(),
                "Variant": 2,    
            },
        ]
    }
};
