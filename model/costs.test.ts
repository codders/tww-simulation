import { ColdCostGenerator } from "./costs";
import { sanierung } from "./sanierung";

test("Kaltmiete Variant 3 - 20230119", () => {
    const costs = new ColdCostGenerator(sanierung)
    costs.setDirektKredite(700000)
    expect(costs.getSparkasseTilgungAmount().toFixed(2)).toBe("32000.00")
    expect(costs.getSparkasseZinsenAmount().toFixed(2)).toBe("8500.00")
    expect(costs.getDkTilgungAmount(3).toFixed(2)).toBe("4620.00")
    expect(costs.getFinancingCosts(3).toFixed(2)).toBe("83210.36")
    expect(costs.getKaltMiete(3).toFixed(2)).toBe("11.46")
})

test("Kaltmiete Variant 4 - 20230119", () => {
    const costs = new ColdCostGenerator(sanierung)
    costs.setDirektKredite(700000)
    expect(costs.getKaltMiete(4).toFixed(2)).toBe("11.32")
})