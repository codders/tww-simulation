import { sanierung, Sanierung, SanierungParams } from "./sanierung"

const basisParameters20221214: SanierungParams = Object.assign(sanierung.sanierung, {
    NettoBaukostenVariant1: 630283.46,
    OldDKs: 837859,
})

test("calculate Instandhaltungskosten - 20221214", () => {
    expect(sanierung.getInstandhaltungsKosten()).toBe(6810)
})

test("calculate Solidarbeitrag - 20221214", () => {
    expect(sanierung.getSolidarbeitrag()).toBe(817.2)
})

test("required DKs variant 1 - 20221214", () => {
    expect(new Sanierung(basisParameters20221214).getUncoveredCosts(1).toFixed(2)).toBe("159037.32")
})

test("required DKs variant 2 - 20221214", () => {
    expect(sanierung.getUncoveredCosts(2).toFixed(2)).toBe("687452.39")
})