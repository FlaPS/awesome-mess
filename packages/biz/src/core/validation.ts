import {allPass, compose, isEmpty, isNil, map, not, prop} from 'ramda'

import {Scheme} from './Scheme'
import {BizState} from '../BizState'
import {getStore} from '@local/root'
import {sel} from '../sel'

export type Action = {
    type: string
}

export type KeyOf<T> = keyof T

export type KeyedMap<V, T> = {
    [P in keyof Partial<T>]: V
}


// Validator takes a value of Some type, checks one and returns the array of validation messages
export type Predicate<T> = (value: T, item: any) => boolean

// generate errors message,
type ErrorGenerator<T> = (value?: T) => string

// error text, or a error generator function
export type ErrorMsg<T> = string

const isErrorGenerator = <T>(value: any, item: any): value is ErrorGenerator<T> =>
    value instanceof Function

// pair of predicate to test, and error message in case of predicate
export type Rule<T> = [Predicate<T>, ErrorMsg<T>]

type RuleResult = true | string

export type Spec<D> = {
    [index: string]: Array<Rule<any>>
}

export type SpecResult<D> = KeyedMap<string[], D>

const runRule =
    <T>([predicate, error]: [Predicate<T>, ErrorMsg<T>]) =>
        (value: T, item: any): RuleResult => {

            return predicate(value, item) || error
        }

const runRules: any = map(runRule)

export const validation = <D>(spec: Spec<D>) => (input: D): SpecResult<D> => {
    const result: SpecResult<D> = {} as any as SpecResult<D>
    Object.keys(spec).map((key: keyof D) => {
            const rules: Array<Rule<any>> = spec[key]

            let subResult = []

            if (rules && rules[0]) {
                if (rules[0][0] === isRequired) {
                    if (!input[key])
                        subResult.push(rules[0][1])
                    else
                        subResult = rules.map(r => runRule(r)(input[key], input)).filter(v => v !== true)
                } else if (input[key] !== undefined)
                    subResult = rules.map(r => runRule(r)(input[key], input)).filter(v => v !== true)
            }

            if (subResult.length)
                result[key] = subResult
        }
    )
    return result
}


export const createSpec = <T>(scheme: Scheme<T>, onlyProps?: string[]):
    (input: T, state?: { biz: BizState }) => SpecResult<T> => {

    if (!onlyProps) {
        onlyProps = Object.keys(scheme.properties)
    }

    const spec: Spec<T> = {}

    onlyProps.forEach(property => {
        if (scheme.properties[property]) {
            spec[property] = []
            if (scheme.properties[property].required) {
                spec[property].push([isRequired, 'Требутеся указать'])
            }
            if (scheme.properties[property].unique) {
                spec[property].push([isUnique(scheme, property), 'Должно быть уникальным'])
            }
            if (scheme.properties[property].rules) {
                spec[property] = spec[property].concat(scheme.properties[property].rules)
            }
        }
    })

    return validation(spec)
}

export const hasCapitalLetter = a => /[A-Z]/.test(a)
export const isGreaterThan = (len: number) => (a: number) => (a > len)
export const isSmallerThan = (len: number) => (a: number) => (a < len)
export const isLengthGreaterThan = (len: number) => compose(isGreaterThan(len), prop('length'))
export const isLengthSmallerThan = (len: number) => compose(isSmallerThan(len), prop('length'))
export const notEmpty = allPass([compose(not, isEmpty), compose(not, isNil), isLengthGreaterThan(0)])
export const isRequired = value => Boolean(value)

export const isUnique =
    <T>(scheme: Scheme<T>, property) =>
        (value: any, item: T, state: { biz: BizState } = getStore<{ biz: BizState }>().getState()) => {

            const list = sel(scheme).asList()()
                .filter(o => o[scheme.uniqueProperty] !== item[scheme.uniqueProperty])
            const result = list
                .map(o => o[property])
                .includes(item[property])

            return !result
        }

