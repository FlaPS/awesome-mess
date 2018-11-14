import {Scheme, ValueMeta} from './core/Scheme'
import {schemes} from './schemes'
import {filterObj, toIndexedArray} from '@local/utils'
import {BizState, StateWithBiz} from './BizState'
import {getStore} from '@local/root'
import {keys, pick} from 'ramda'
import {Lens} from 'monocle-ts'


export const getSchemeByName = <T>(upperCase: string): Scheme<T> =>
    schemes[upperCase]

const bizSelector = (state: StateWithBiz) => state.biz

const getState = () => getStore().getState() as any as StateWithBiz

type FilterPredicate<T> = <T>(value: T) => boolean

export const keyLens = <T>(key: keyof T) =>
    Lens.fromProp<T, any>(key)

export const schemeLens = <T, Spec, Selectors>(schemeOrName: Scheme<T, Spec, Selectors> | string) => {
    const scheme: Scheme<T> = typeof schemeOrName === 'string'
        ? schemes[schemeOrName]
        : schemeOrName
    return Lens.fromPath<StateWithBiz, any, any>(['biz', scheme.keyBuilder.keys[0].path])
}


export const getByKey = <T>(scheme: Scheme<T>) => (id: string) => (state: { biz: BizState }) =>
    schemeLens(scheme)
        .compose(keyLens(id))
        .get(state)

export const getNextId = <T>(scheme: Scheme<T>) => (state: { biz: BizState }) => {
    const val = schemeLens(scheme)
        .get(state)
    const lastId = Object.keys(val)
        .sort((a, b) => Number(a) - Number(b))
        .reverse()[0]
    const nextId = isNaN(Number(lastId)) ? '0' : String(Number(lastId) + 1)
    return nextId
}


export const objectLens = <T>(scheme: Scheme<T>) => (spec: any) =>
    schemeLens(scheme)
        .compose(Lens.fromProp(spec[scheme.uniqueProperty]))
export const sel = <T>(schemeOrName: Scheme<T> | string) => {
    const scheme: Scheme<T> = typeof schemeOrName === 'string'
        ? getSchemeByName(schemeOrName)
        : schemeOrName

    type ByIdGetter = {
        (id: string): (state?: StateWithBiz) => T
        (id: string[]): (state?: StateWithBiz) => T[]
    }
    return {
        propOf: (property: keyof T) =>
            (item: T | string) =>
                (state: StateWithBiz = getState()) => {
                    const prop: ValueMeta = scheme.properties[property]
                    const resultScheme = prop.schemeName
                    const obj = typeof item === 'string'
                        ? sel(scheme).byKey(item)(state)
                        : item
                    if (prop.type === 'itemOf' || prop.type === 'arrayOf')
                        return sel(resultScheme).byKey(obj[property] as any as string)(state)

                    return obj[property]
                },


        asList: (predicate?: FilterPredicate<T>) =>
            (state: StateWithBiz = getState()) =>
                predicate
                    ? toIndexedArray<T>(state.biz[scheme.ownerKey]).filter(predicate)
                    : toIndexedArray<T>(state.biz[scheme.ownerKey]),

        asMap: (predicate?: FilterPredicate<T>) =>
            (state: StateWithBiz = getState()) =>
                predicate
                    ? filterObj(predicate)(state.biz[scheme.ownerKey])
                    : state.biz[scheme.ownerKey],

        asKeys: (predicate?: FilterPredicate<T>) =>
            (state: StateWithBiz = getState()) =>
                keys(predicate
                    ? filterObj(predicate)(state.biz[scheme.ownerKey])
                    : state.biz[scheme.ownerKey]) as string[],

        byKey: ((id: string | string[] = []) =>
            (state: StateWithBiz = getState()): T | T[] =>
                typeof id === 'string'
                    ? state.biz[scheme.ownerKey][id] || {} as any as T
                    : pick(id, state.biz[scheme.ownerKey])) as ByIdGetter,

        bySpec: (idOrSpec: string | any) =>
            (state: StateWithBiz = getState()): T =>
                state.biz[scheme.ownerKey][idOrSpec] || {} as any as T,

        getFullName: scheme.getFullName,
        getShortName: scheme.getShortName,
    }
}
