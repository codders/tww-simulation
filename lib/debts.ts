import { Sanierung } from "../model/sanierung";

export class DebtGenerator
{
    sanierung: Sanierung;
    direktKredite: number;

    constructor(sanierung: Sanierung) {
        this.sanierung = sanierung;
        this.direktKredite = 0;
    }
    getKfwLoanSize(variant: number) {
        if (variant === 1) {
            return 0;
        }
        return Math.max(this.sanierung.getUncoveredCosts(variant) - this.direktKredite, 0);
    }
    getTotalDKs(variant: number) {
        return this.sanierung.getExistingDirektKredite() + Math.min(this.direktKredite, this.sanierung.getUncoveredCosts(variant));
    }
    setDirektKredite(direktKredite: number) {
        return this.direktKredite = direktKredite;
    }
    generateVariant(variant: number) {
        return {
                "DirektKredite": this.getTotalDKs(variant),
                "Kfw": this.getKfwLoanSize(variant),
                "Sparkasse": this.sanierung.getSparkasseOutstandingLoanAmount(),
                "Variant": variant,
            }
    }
};
