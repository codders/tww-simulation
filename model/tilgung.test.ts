import { sanierung, Sanierung, SanierungParams } from "./sanierung"
import { TilgungGenerator } from "./tilgung"

const basisParameters20221214: SanierungParams = Object.assign(sanierung.sanierung, {
    NettoBaukostenVariant1: 630283.46,
    OldDKs: 837859,
})

test("annuity amount sparkasse - 20221214", () => {
    expect(new TilgungGenerator(new Sanierung(basisParameters20221214)).getSparkasseAnnuity().toFixed(2)).toBe("40500.00")
})

test("Total DKs variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20221214))
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getTotalDKs(1).toFixed(2)).toBe("1496896.32")
})

test("annuity amount DKs variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20221214))
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getDkAnnuity(1).toFixed(2)).toBe("19459.65")
})

test("annuity total amount variant 1 - 20221214", () => {
    const tilgung = new TilgungGenerator(new Sanierung(basisParameters20221214))
    tilgung.setDirektKredite(sanierung.getUncoveredCosts(1))
    expect(tilgung.getTotalAnnuity(1).toFixed(2)).toBe("59959.65")
})