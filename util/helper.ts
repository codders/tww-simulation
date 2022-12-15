import { Bauvariant } from "../model/sanierung"

export function cloneVariants(v: Bauvariant[]): Bauvariant[] {
    return v.map(a => Object.assign({}, a))
}
export function updateVariant(v: Bauvariant[], variantNumber: number, update: any) {
    const vi = v.findIndex(va => va.Variant === variantNumber)
    v[vi] = Object.assign(v[vi], update)
}