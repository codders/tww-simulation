import { Sanierung } from "../model/sanierung";

export class WarmCostGenerator
{
    sanierung: Sanierung;
    gasPreisEuroProkWh: number;
    stromPreisEuroProkWh: number;

    constructor(sanierung: Sanierung) {
        this.sanierung = sanierung;
        this.gasPreisEuroProkWh = this.sanierung.getGasPreisEuroProkWh();
        this.stromPreisEuroProkWh = this.sanierung.getStromPreisEuroProkWh();
    }
    getGasPreisEuroProkWh() {
        return this.gasPreisEuroProkWh;
    }
    getStromPreisEuroProkWh() {
        return this.stromPreisEuroProkWh;
    }
    setGasPreisEuroProkWh(gasPreisEuroProkWh: number) {
        this.gasPreisEuroProkWh = gasPreisEuroProkWh;
    }
    setStromPreisEuroProkWh(stromPreisEuroProkWh: number) {
        this.stromPreisEuroProkWh = stromPreisEuroProkWh
    }
    getNebenkosten(variant: number) {
        if (variant === 1) {
            return this.sanierung.getGasBasisPreisProQMProMonat()
                 + (this.sanierung.getGasverbrauchkWhProQMProMonatVariant1() * this.getGasPreisEuroProkWh())
                 + this.sanierung.getStromBasisPreisProQMProMonat()
                 + (this.sanierung.getStromverbrauchkWhProQMProMonatVariant1() * this.getStromPreisEuroProkWh())
                 + this.sanierung.getHausnebenkostenProQMProMonatVariant1();
        }
        if (variant === 2) {
            return this.sanierung.getStromBasisPreisProQMProMonat()
                 + (this.sanierung.getStromverbrauchkWhProQMProMonatVariant2() * this.getStromPreisEuroProkWh())
                 + this.sanierung.getHausnebenkostenProQMProMonatVariant2()
                 + this.sanierung.getBetriebskostenProQMProMonatVariant2();
        }
        throw new Error("Invalid Variant")
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
