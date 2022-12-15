import { Sanierung } from "./sanierung";

export class WarmCostGenerator {
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
        return this.sanierung.getGasBasisPreisProQMProMonat()
            + (this.sanierung.getGasverbrauchkWhProQMProMonat(variant) * this.getGasPreisEuroProkWh())
            + this.sanierung.getStromBasisPreisProQMProMonat()
            + (this.sanierung.getStromverbrauchkWhProQMProMonat(variant) * this.getStromPreisEuroProkWh())
            + this.sanierung.getHausnebenkostenProQMProMonat(variant)
            + this.sanierung.getBetriebskostenProQMProMonat(variant);
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
