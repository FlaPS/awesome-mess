import * as R from 'ramda'
import {Arrify, arrify} from '@local/utils'

type Predicate<T> = (value: T) => boolean

export type PropCond<T, K extends keyof T> = Predicate<T[K]> | T[K]

export type WhereCond<T> = {
    [K in keyof T]?: PropCond<T, K>
}

type RWhereCond<T> = {
    [K in keyof T]?: Predicate<T[K]>
}

const asPredicate = <T, D>(value: Predicate<T> | D) =>
    (typeof value === 'function'
        ? value
        : R.equals(value))

const convertCondToRWhere = <T>(cond: WhereCond<T>): Predicate<T> =>
    R.where(R.map(asPredicate, cond) as RWhereCond<T>)

export const wherePred = <T>(conds: Arrify<WhereCond<T>>): Predicate<T> =>
    R.compose(R.anyPass, R.map(convertCondToRWhere), arrify)(conds)
