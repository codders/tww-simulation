import { sanierung, Sanierung } from "./sanierung"
import { TilgungGenerator } from "./tilgung"
import { basisParameters20230119, sanierung20221214, sanierung20230119, variants20221214 } from "./variantHistory";

test("annuity amount sparkasse - 20221214", () => {
    expect(new TilgungGenerator(sanierung20221214).getSparkasseAnnuity().toFixed(2)).toBe("40500.00")
})

test("Total DKs variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(sanierung20221214)
    tilgung.setDirektKredite(sanierung20230119.getUncoveredCosts(1))
    expect(tilgung.getTotalDKs(1).toFixed(2)).toBe("1496896.32")
})

test("Total DKs variant 4 - 20230404", () => {
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(400000)
    expect(tilgung.getTotalDKs(4).toFixed(2)).toBe("1204467.93")
})

test("Total KfW variant 4 - 20230404", () => {
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(400000)
    expect(tilgung.sanierung.getUncoveredCosts(4).toFixed(2)).toBe("1465476.18")
    expect(tilgung.getKfwLoanSize(4).toFixed(2)).toBe("1065476.18")
})

test("annuity amount DKs variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(sanierung20221214)
    tilgung.setDirektKreditZinsen(0.8)
    tilgung.setDirektKreditTilgung(0.5)
    tilgung.setDirektKredite(sanierung20230119.getUncoveredCosts(1))
    expect(tilgung.getDkAnnuity(1).toFixed(2)).toBe("19459.65")
})

test("annuity total amount variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(sanierung20221214)
    tilgung.setDirektKreditZinsen(0.8)
    tilgung.setDirektKreditTilgung(0.5)
    tilgung.setDirektKredite(sanierung20230119.getUncoveredCosts(1))
    expect(tilgung.getTotalAnnuity(1).toFixed(2)).toBe("59959.65")
})

test("annuity amounts variant 3 - 20230119", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20230119, variants20221214));
    tilgung.setDirektKredite(700000)
    tilgung.setDirektKreditZinsen(1.2)
    expect(tilgung.getDkAnnuity(3).toFixed(2)).toBe("23100.00")
    expect(sanierung20230119.getUncoveredCosts(3).toFixed(2)).toBe("1231446.18")
    expect(tilgung.getKfwLoanSize(3).toFixed(2)).toBe("531446.18")
    expect(tilgung.getTotalAnnuity(3).toFixed(2)).toBe("85389.29")
})

test("annuity amounts variant 4 - 20230119", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20230119, variants20221214));
    tilgung.setDirektKredite(700000)
    tilgung.setDirektKreditZinsen(1.2)
    expect(tilgung.getDkAnnuity(4).toFixed(2)).toBe("23100.00")
    expect(tilgung.getTotalAnnuity(4).toFixed(2)).toBe("84204.23")
})

test("annuity amounts variant 4 - 20230404", () => {
    const tilgung = new TilgungGenerator(sanierung);
    tilgung.setDirektKredite(400000)
    tilgung.setDirektKreditZinsen(1.0)
    tilgung.setDirektKreditTilgung(0.3)
    expect(tilgung.getDkAnnuity(4).toFixed(2)).toBe("15658.08")
    expect(tilgung.getKfwLoanSize(4).toFixed(2)).toBe("1065476.18")
    expect(tilgung.getKfwAnnuity(4).toFixed(2)).toBe("42725.59")
    expect(tilgung.getTotalAnnuity(4).toFixed(2)).toBe("98883.68")
})