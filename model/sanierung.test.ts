import { cloneVariants, updateVariant } from "../util/helper"
import { sanierung, Sanierung, SanierungParams, variants } from "./sanierung"

const basisParameters20221214: SanierungParams = Object.assign(Object.assign({}, sanierung.sanierung), {
    KfwTilgung: 0.0333,
    KontoPuffer: 20000,
    OldDKs: 837859,
})

const variants20221214 = cloneVariants(variants)
updateVariant(variants20221214, 1, { NettoBaukosten: 630283.46 })
updateVariant(variants20221214, 2, { NettoBaukosten: 1074329.74 })

test("Clone and update", () => {
    expect(new Sanierung(basisParameters20221214, variants20221214).getNettoBaukosten(2)).toBe(1074329.74)
})

test("calculate Instandhaltungskosten - 20221214", () => {
    expect(sanierung.getInstandhaltungsKosten()).toBe(6810)
})

test("calculate Solidarbeitrag - 20221214", () => {
    expect(sanierung.getSolidarbeitrag()).toBe(817.2)
})

test("required DKs variant 1 - 20221214", () => {
    expect(new Sanierung(basisParameters20221214, variants20221214).getUncoveredCosts(1).toFixed(2)).toBe("659037.32")
})

test("required DKs variant 2 - 20221214", () => {
    expect(new Sanierung(basisParameters20221214, variants20221214).getUncoveredCosts(2).toFixed(2)).toBe("1187452.39")
})

test("required DKs variant 3 - 20230119", () => {
    expect(sanierung.getUncoveredCosts(3).toFixed(2)).toBe("1231446.18")
})

test("required DKs variant 4 - 20230119", () => {
    expect(sanierung.getUncoveredCosts(4).toFixed(2)).toBe("1202542.22")
})