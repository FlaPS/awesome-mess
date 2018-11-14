import {arrify, Arrify, AssociativeArray, filterObj, isArray, toIndexedArray, UnaryFn} from '@local/utils'
import {StateWithBiz} from '../BizState'
import * as R from 'ramda'
import {compose, Dictionary, filter, Fn1, keys, pick} from 'ramda'
import {ValueMeta} from './valueTypes'
import {KeyBuilder, KeyOrSpec} from './KeyBuilder'

import {randomElement} from '@local/random'
import {getStore} from '@local/root'
import {PropCond, WhereCond, wherePred} from './wherePred'
import addSchemeSelector from './addSchemeSelector'
import {BizAction} from '../actions/BizAction'
import * as constants from '../actions/constants'


export {
    KeyOrSpec
}

const getState = () => getStore().getState() as any as StateWithBiz

type Predicate<T> = (value: T) => boolean

type Empty = {}

const logger = console
/**
 * Basic value object into application state
 */
export type Selector<S, R> = (state?: S) => R
export type BizSelector<R> = Selector<StateWithBiz | any, R>
export type Querier<R, P = any> = <C = P>(props: C) => BizSelector<R>

export {ValueMeta}

export type SchemeLang = {
    singular: string,
    some: string,
    plural: string,
    name?: string,
    gender?: 'm' | 'n' | 'f',
}

export const defaultLang: SchemeLang = {
    singular: 'объект',
    some: 'объекта',
    plural: 'объектов',
    name: 'объекты',
    gender: 'n',
}

export type SchemeSettings<T, Spec = {}, Selectors = {}, OwnKey extends Partial<Spec> = any> = {
    name: string
    autoCreate?: boolean
    table?: string
    actionPrefix?: string
    keyBuilder: KeyBuilder<T, Spec, OwnKey>
    lang?: SchemeLang
    aclKey?: string
    uniqueProperty?: OwnKey
    ownerKey?: string
    isReference?: boolean
    item?: T & Partial<Spec>
    spec?: Spec
    keyOrSpec?: Spec | string
    getFullName?: (item: T | string) => BizSelector<string>
    getShortName?: (item: T | string) => BizSelector<string>
    selectors?: Selectors
    modifications?: Partial<T>,
}

type AsList<T> = (pred?: Predicate<T>) => BizSelector<T[]>
type AsMap<T> = (pred?: Predicate<T>) => BizSelector<Dictionary<T>>
type AsIds<T> = (pred?: Predicate<T>) => BizSelector<string[]>

type SpecGetter<T, Spec> = {
    (id: KeyOrSpec<Spec>): BizSelector<T>
    (id: KeyOrSpec<Spec>[]): BizSelector<Dictionary<T>>
    asMap: BizSelector<Dictionary<T>>
    asList: SpecGetterToList<T, Spec>
    asKeys: SpecGetterToIds<T, Spec>
}

type SpecGetterToMap<T, Spec> =
    (id: KeyOrSpec<Spec> | KeyOrSpec<Spec>[]) => BizSelector<AssociativeArray<T>>

type SpecGetterToList<T, Spec> =
    (id: KeyOrSpec<Spec> | KeyOrSpec<Spec>[]) => BizSelector<T[]>

type SpecGetterToIds<T, Spec> =
    (id: KeyOrSpec<Spec> | KeyOrSpec<Spec>[]) => BizSelector<string[]>

type WhereGetterList<T> = UnaryFn<WhereCond<T>, T[]>


export type Scheme<T, Spec = {}, Selectors = {}, OwnKey extends Partial<Spec> = any> =
    SchemeSettings<T, Spec, Selectors, OwnKey> &
    {
        item: T & Spec,
        properties?: Record<keyof T, ValueMeta>
        isCabinet?: boolean
        byKey: SpecGetter<T, Spec>
        bySpec: SpecGetter<T, Spec>
        asMap: AsMap<T>
        asList: AsList<T>
        asKeys: AsIds<T>
        focus: (keyPart: string) => Scheme<T, Partial<Spec>, Selectors, OwnKey>
        getFullName?: (item: T | string) => BizSelector<string>
        getShortName?: (item: T | string) => BizSelector<string>
        randomKey: (predicate?: WhereCond<T>) => BizSelector<string>
        create: (key: KeyOrSpec<Spec>, patch?: Partial<T>) => BizAction<T>
        update: (key: KeyOrSpec<Spec>, patch?: Partial<T>) => BizAction<T>
    }

export type ItemListSelector<T, Params = {}> = UnaryFn<Params, T>


export const createScheme = <T, Spec, OwnKey extends Partial<Spec> = any>
(params: { properties: T } & SchemeSettings<any, Spec, any, OwnKey>, focusGetter = state => state.biz) => {
    /*   type ItemVO = typeof params.properties
       type Spec = typeof params.keyBuilder.spec*/
    const keyBuilder = params.keyBuilder
    const keysAr = keyBuilder.keys
    const ownerKey = keysAr[0].path
    const uniqueProperty = keysAr[0].path

    const makeKey = keyBuilder.buildKey


    let prev = {}

    const getAllAsMap = (state: StateWithBiz) => {
        const first = state.biz[keysAr[0].path]
        /* if (first === prev)
             retu*/
        let result = {}
        if (keysAr.length === 2) {

            const firstKeys = Object.keys(first)
            for (let i = 0; i < firstKeys.length; i++) {
                const k = firstKeys[i]
                const firstItem = first[firstKeys[i]] || {}
                const secondKeys = firstItem[keysAr[1].path] || {}

                Object.keys(secondKeys).forEach(k1 =>
                    result[k + '/' + k1] = first[k][keysAr[1].path][k1]
                )

            }


        }
        else
            result = first

        if (result === undefined) {
            logger.error('Scheme key is undefined', params.name)
        }

        return result
    }


    const asMap = (predicate?: Predicate<T>) =>
        (state: StateWithBiz = getState()) =>
            typeof predicate === 'function'
                ? filterObj(predicate)(getAllAsMap(state))
                : getAllAsMap(state)


    const asList = (
        (predicate?: Predicate<T>) =>
            compose(toIndexedArray, asMap(predicate))
    )   as any as AsList<T>

    const asKeys = (
        (predicate?: Predicate<T>) =>
            compose(keys, asMap(predicate))
    )   as any as AsIds<T>


    const bySpecRaw = (specs: KeyOrSpec<Spec> | KeyOrSpec<Spec>[]) =>
        (state: StateWithBiz = getState()) =>
            isArray(specs)
                ? arrify(specs).map(spec => R.view(keyBuilder.getLens(spec), state))
                : R.view(keyBuilder.getLens(specs), state)


    const buildSelectors = (pred: Predicate<T>) =>
        Object.assign(
            asMap(pred),
            {
                pred,
                asMap: asMap(pred),
                asList: asList(pred),
                asKeys: asKeys(pred),
            }
        )

    const buildVariadic = <I = any>(predicateBuilder: Fn1<I, Predicate<T>>) =>
        (query: I) => buildSelectors(predicateBuilder(query))

    const whereVariadic = buildVariadic(wherePred)
    /*(cond: Arrify<WhereCond<T>>) => {
                const pred = wherePred(cond)
                return buildSelectors(wherePred(pred))
            }*/

    const wherePropVariadic = <PropName extends keyof T>(prop: PropName) =>
        (propCond: Arrify<PropCond<T, PropName>>) =>
            whereVariadic(arrify(propCond).map(cond => ({[prop]: cond})))


    const bySpec =
        Object.assign(
            bySpecRaw,
            {
                asList: R.compose(arrify, bySpecRaw),
                asKeys: R.compose(R.keys, bySpecRaw),
            }
        )


    const byKey = (id: Arrify<string> = []) =>
        (state: StateWithBiz = getState()): T | T[] =>
            typeof id === 'string'
                ? state.biz[ownerKey][id] || {}
                : pick(id, state.biz[ownerKey])

    const create = (key: KeyOrSpec<Spec>, patch?: T): BizAction<T> => ({
        type: constants.BIZ_PREFIX + params.name + constants.CREATED_POSTFIX,
        payload: {
            id: keyBuilder.buildKey(key),
            patch: patch || keyBuilder.parseSpec(key) as any as T,
        },
    })

    const update = (key: KeyOrSpec<Spec>, patch?: T): BizAction<T> => ({
        type: constants.BIZ_PREFIX + params.name + constants.UPDATED_POSTFIX,
        payload: {
            id: keyBuilder.buildKey(key),
            patch: patch || keyBuilder.parseSpec(key) as any as T,
        },
    })

    const getItem = (value: T | string) => state =>
        typeof value === 'string'
            ? bySpec(value)(state)
            : value

    const getFullName = (item: T | string) => state => {
        const value = getItem(item)(state)

        return params.getFullName
            ? params.getFullName(value)(state)
            : value['name']
    }

    const getShortName = (item: T | string) => state => {
        const value = getItem(item)(state)

        return params.getShortName
            ? params.getShortName(value)(state)
            : value['name']
    }

    return Object.assign(
        {
            ...params,
            keyBuilder,
            actionPrefix: params.actionPrefix || params.name.toUpperCase(),
            table: params.table || params.name.toLowerCase(),
            ownerKey,
            uniqueProperty: params.keyBuilder.keys[0].path as any as OwnKey,
            create,
            update,
            isCabinet: params.keyBuilder.keys.length > 1,
            name: params.name,
            properties: params.properties,
            lang: params.lang || defaultLang,
            spec: params.spec,
            aclKey: params.aclKey,
            autoCreate: params.autoCreate,

        } as  any as Scheme<T & Spec, Spec, Dictionary<ItemListSelector<T>>, OwnKey>,
        {
            asMap,
            getFullName,
            getShortName,
            randomKey: (predicate?: WhereCond<T>) => (state?: StateWithBiz) =>
                predicate
                    ? randomElement(whereVariadic(predicate).asKeys(state))
                    : randomElement(asKeys()(state)),
            asList,
            asKeys,
            whereProp: wherePropVariadic,
            where: whereVariadic,
            bySpec,
            byKey: bySpec,
            addSelector: addSchemeSelector(keyBuilder),
            focus: (keyPart: string) => {
                const focusedkeyBuilder = {...keyBuilder, keys: keyBuilder.keys.slice(1)}
                createScheme({...params, keyBuilder: focusedkeyBuilder},
                    state =>
                        focusGetter(state)[keyBuilder.keys[0].path][keyPart]
                )
            },
        }
    )
}


const isSearchableProperty = (p: ValueMeta) =>
    p.type === 'string' || p.type === 'text' || p.type === 'datetime'

export const getSearchableProps = <T>(scheme: Scheme<T>): string[] =>
    Object.keys(
        filter(isSearchableProperty, scheme.properties)
    )

export const UNKNOWN: Scheme<any> = {
    properties: {},
    lang: {},
} as any as Scheme<any>

