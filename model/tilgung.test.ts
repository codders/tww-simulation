import { cloneVariants, updateVariant } from "../util/helper"
import { sanierung, Sanierung, SanierungParams, variants } from "./sanierung"
import { TilgungGenerator } from "./tilgung"

const basisParameters20221214: SanierungParams = Object.assign(Object.assign({}, sanierung.sanierung), {
    KfwTilgung: 0.0333,
    KontoPuffer: 20000,
    OldDKs: 837859,
})
const variants20221214 = cloneVariants(variants);
updateVariant(variants20221214, 1, { NettoBaukosten: 630283.46 })
updateVariant(variants20221214, 2, { NettoBaukosten: 1074329.74 })

test("annuity amount sparkasse - 20221214", () => {
    expect(new TilgungGenerator(new Sanierung(basisParameters20221214, variants20221214)).getSparkasseAnnuity().toFixed(2)).toBe("40500.00")
})

test("Total DKs variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20221214, variants20221214))
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getTotalDKs(1).toFixed(2)).toBe("1496896.32")
})

test("annuity amount DKs variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20221214, variants20221214))
    tilgung.setDirektKreditZinsen(0.8)
    tilgung.setDirektKreditTilgung(0.5)
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getDkAnnuity(1).toFixed(2)).toBe("19459.65")
})

test("annuity total amount variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20221214, variants20221214))
    tilgung.setDirektKreditZinsen(0.8)
    tilgung.setDirektKreditTilgung(0.5)
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getTotalAnnuity(1).toFixed(2)).toBe("59959.65")
})

test("annuity amounts variant 3 - 20221214", () => {
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(700000)
    expect(tilgung.getDkAnnuity(3).toFixed(2)).toBe("23100.00")
    expect(sanierung.getUncoveredCosts(3).toFixed(2)).toBe("1213173.20")
    expect(tilgung.getKfwLoanSize(3).toFixed(2)).toBe("513173.20")
    expect(tilgung.getTotalAnnuity(3).toFixed(2)).toBe("84640.10")
})

test("annuity amounts variant 4 - 20221214", () => {
    const tilgung = new TilgungGenerator(sanierung)
    tilgung.setDirektKredite(700000)
    expect(tilgung.getDkAnnuity(4).toFixed(2)).toBe("23100.00")
    expect(tilgung.getTotalAnnuity(4).toFixed(2)).toBe("87691.86")
})
