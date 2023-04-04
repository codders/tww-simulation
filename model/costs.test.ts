import { ColdCostGenerator } from "./costs";
import { sanierung, Sanierung } from "./sanierung";
import { basisParametersBase, sanierung20230119, variants20230119 } from "./variantHistory";

test("Kaltmiete Variant 3 - 20230119", () => {
    const costs = new ColdCostGenerator(sanierung20230119)
    costs.setDirektKredite(700000)
    costs.setDirektKreditZinsen(1.2)
    expect(costs.getSparkasseTilgungAmount().toFixed(2)).toBe("32000.00")
    expect(costs.getSparkasseZinsenAmount().toFixed(2)).toBe("8500.00")
    expect(costs.getDkTilgungAmount(3).toFixed(2)).toBe("4620.00")
    expect(costs.getFinancingCosts(3).toFixed(2)).toBe("83210.36")
    expect(costs.getKaltMiete(3).toFixed(2)).toBe("11.46")
})

test("Kaltmiete Variant 3 - 20230125", () => {
    const costs = new ColdCostGenerator(new Sanierung(basisParametersBase, variants20230119))
    costs.setDirektKredite(400000)
    expect(costs.getSparkasseTilgungAmount().toFixed(2)).toBe("32000.00")
    expect(costs.getSparkasseZinsenAmount().toFixed(2)).toBe("8500.00")
    expect(costs.getDkTilgungAmount(3).toFixed(2)).toBe("3720.00")
    expect(costs.getFinancingCosts(3).toFixed(2)).toBe("89320.78")
    expect(costs.getKaltMiete(3).toFixed(2)).toBe("12.23")
})

test("Kaltmiete Variant 4 - 20230119", () => {
    const costs = new ColdCostGenerator(sanierung20230119)
    costs.setDirektKredite(700000)
    costs.setDirektKreditZinsen(1.2)
    expect(costs.getKaltMiete(4).toFixed(2)).toBe("11.32")
})

test("Kaltmiete Variant 4 - 20230404", () => {
    const costs = new ColdCostGenerator(sanierung, 0)
    costs.setDirektKredite(400000)
    costs.setDirektKreditZinsen(1.0)
    costs.setDirektKreditTilgung(0.3)
    expect(costs.getFinancingCosts(4).toFixed(2)).toBe("98883.68")
    expect(costs.sanierung.getInstandhaltungsKosten().toFixed(2)).toBe("6810.00")
    expect(costs.sanierung.getVerwaltungsKosten().toFixed(2)).toBe("2043.00")
    expect(costs.sanierung.getSolidarbeitrag().toFixed(2)).toBe("817.20")
    expect(costs.getMietausfallwagnis(4).toFixed(2)).toBe("3357.34")
    expect(costs.getTotalCosts(4).toFixed(2)).toBe("111911.21")
    expect(costs.getKaltMiete(4).toFixed(2)).toBe("13.69")
})