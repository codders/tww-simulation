import { Sanierung } from "../../model/sanierung";

export class WarmCostGenerator
{
    sanierung: Sanierung;

    constructor(sanierung: Sanierung) {
        this.sanierung = sanierung;
    }
    getNebenkosten(variant: number) {
        return 2;
    }
    generateVariants() {
        return [
            {
                "Nebenkosten": this.getNebenkosten(1),
                "Variant": 1,    
            },
            {
                "Nebenkosten": this.getNebenkosten(2),
                "Variant": 2,
            }        
        ]
    }
};
