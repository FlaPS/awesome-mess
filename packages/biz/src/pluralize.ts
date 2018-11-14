import {defaultLang, Scheme} from './core/Scheme'

const getCount = (quant: number | any) =>
    typeof quant === 'number'
        ? quant
        : (
            quant.length
                ? quant.length
                : Object.keys(quant).length
        )

const getString = (scheme: Scheme<any>, quant) => {
    const quantity = getCount(quant)
    const lang = scheme.lang || defaultLang

    if ((quantity % 100 <= 20 && quantity % 100 >= 11)
        || (quantity % 10 >= 5 && quantity % 10 <= 9)
        || (quantity % 10 === 0))
        return lang.plural

    if (quantity % 10 === 1)
        return lang.singular

    if (quantity === 0)
        return lang.plural

    return lang.some
}

export default <T>(scheme: Scheme<T>, prependQuant: boolean = true) => (quant: number | any = 0) =>
    prependQuant
        ? quant + ' ' + getString(scheme, quant)
        : getString(scheme, quant)
