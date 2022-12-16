import { ColdCostGenerator } from "./costs";
import { sanierung } from "./sanierung";

test("Kaltmiete Variant 3 - 20221214", () => {
    const costs = new ColdCostGenerator(sanierung)
    costs.setDirektKredite(700000)
    expect(costs.getSparkasseTilgungAmount().toFixed(2)).toBe("32000.00")
    expect(costs.getSparkasseZinsenAmount().toFixed(2)).toBe("8500.00")
    expect(costs.getDkTilgungAmount(3).toFixed(2)).toBe("4620.00")
    expect(costs.getFinancingCosts(3).toFixed(2)).toBe("84640.10")
    expect(costs.getKaltMiete(3).toFixed(2)).toBe("11.64")
})

test("Kaltmiete Variant 4 - 20221214", () => {
    const costs = new ColdCostGenerator(sanierung)
    costs.setDirektKredite(700000)
    expect(costs.getKaltMiete(4).toFixed(2)).toBe("12.02")
})