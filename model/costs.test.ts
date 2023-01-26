import { ColdCostGenerator } from "./costs";
import { basisParameters, Sanierung, sanierung, SanierungParams, variants } from "./sanierung";

const basisParameters20230119: SanierungParams = Object.assign({}, basisParameters, {
    KfwZinssatz: 0.0122,
    StromPreisEuroProkWh: 0.5633,
});

test("Kaltmiete Variant 3 - 20230119", () => {
    const costs = new ColdCostGenerator(new Sanierung(basisParameters20230119, variants))
    costs.setDirektKredite(700000)
    costs.setDirektKreditZinsen(1.2)
    expect(costs.getSparkasseTilgungAmount().toFixed(2)).toBe("32000.00")
    expect(costs.getSparkasseZinsenAmount().toFixed(2)).toBe("8500.00")
    expect(costs.getDkTilgungAmount(3).toFixed(2)).toBe("4620.00")
    expect(costs.getFinancingCosts(3).toFixed(2)).toBe("83210.36")
    expect(costs.getKaltMiete(3).toFixed(2)).toBe("11.46")
})

test("Kaltmiete Variant 3 - 20230125", () => {
    const costs = new ColdCostGenerator(sanierung)
    costs.setDirektKredite(400000)
    expect(costs.getSparkasseTilgungAmount().toFixed(2)).toBe("32000.00")
    expect(costs.getSparkasseZinsenAmount().toFixed(2)).toBe("8500.00")
    expect(costs.getDkTilgungAmount(3).toFixed(2)).toBe("3720.00")
    expect(costs.getFinancingCosts(3).toFixed(2)).toBe("89320.78")
    expect(costs.getKaltMiete(3).toFixed(2)).toBe("12.23")
})

test("Kaltmiete Variant 4 - 20230119", () => {
    const costs = new ColdCostGenerator(new Sanierung(basisParameters20230119, variants))
    costs.setDirektKredite(700000)
    costs.setDirektKreditZinsen(1.2)
    expect(costs.getKaltMiete(4).toFixed(2)).toBe("11.32")
})