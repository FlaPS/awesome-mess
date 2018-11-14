import {Rule} from './validation'
import {DateRangeVO} from './VO'
import {AssociativeArray, cast} from '@local/utils'
import * as TL from 'typelevel-ts'

type MetaType =
    | 'string'
    | 'text'
    | 'boolean'
    | 'number'
    | 'int'
    | 'uint'
    | 'array'
    | 'arrayOf'
    | 'itemOf'
    | 'item'
    | 'any'
    | 'datetime'
    | 'date'
    | 'timestamp'
    | 'daterange'


export type Meta<Shape = {}> = {
    type: MetaType
    schemeName?: string
    unique?: boolean
    saveModificationDate?: boolean
    rules?: Array<Rule<any>>
    required?: boolean
    langRU?: string
    shape?: Shape
    sealed?: boolean
}

export type ValueMeta<Shape = {}> = Meta<Shape>

export type BooleanMeta = ValueMeta<boolean> & {
    type: 'boolean'
}

export type StringMeta = ValueMeta<string> & {
    maxLength?: number
    type: 'string'
}

export type TextMeta = ValueMeta<string> & {
    maxLength?: number
    type: 'text'
}

export type NumberMeta = ValueMeta<number> & {
    minValue?: number
    maxValue?: number
    stepSize?: number
    type: 'number'
}

export type IntMeta = ValueMeta<number> & {
    type: 'int'
}

export type UintMeta = ValueMeta<number> & {
    type: 'uint'
}

export type ArrayMeta<Item = any> = ValueMeta<Readonly<Array<Item>>> & {
    type: 'array'
}

export type ItemMeta<Item = any> = ValueMeta<Item> & {
    type: 'item'
}

export type AnyMeta = ValueMeta<any> & {
    type: 'item'
}

export type ArrayOfMeta = ValueMeta<Array<string>> & {
    schemeName?: string
}

export type ItemOfMeta = ValueMeta<string> & {
    schemeName?: string
}

export type DateTimeMeta = ValueMeta<string> & {
    type: 'datetime'
}

export type DateMeta = ValueMeta<string> & {
    type: 'date'
}

export type TimeStampMeta = ValueMeta<string> & {
    type: 'timestamp'
}

export type DateRangeMeta = ValueMeta<DateRangeVO> & {
    type: 'daterange'
}


const arrayMeta = <Item = any>(meta?: Partial<ArrayMeta<Item>>) =>
    cast<Readonly<Item[]>>(Object.assign({}, meta, {type: 'array'}))

const itemMeta = <Item = any>(meta?: Partial<ItemMeta<Item>>) =>
    cast<Readonly<Item>>(Object.assign({}, meta, {type: 'item'}))

const meta = <T extends ValueMeta<S>, S>(type: MetaType) =>
    (meta?: Partial<T>): S =>
        cast<S>(Object.assign({}, meta, {type}))

export type JSType<T extends ValueMeta> = TL.ObjectOmit<T, keyof Meta>


export type InferredVO<P extends AssociativeArray<ValueMeta>> = Readonly<{
    [K in keyof P]?: JSType<P[K]>
}>


const valueTypes = {
    date: meta<DateMeta, string>('date'),
    text: meta<TextMeta, string>('text'),
    string: meta<StringMeta, string>('string'),
    boolean: meta<BooleanMeta, boolean>('boolean'),
    number: meta<NumberMeta, number>('number'),
    int: meta<IntMeta, number>('int'),
    item: itemMeta,
    any: meta<AnyMeta, any>('any'),
    uint: meta<UintMeta, number>('uint'),
    array: arrayMeta,
    arrayOf: meta<ArrayOfMeta, Array<string>>('arrayOf'),
    itemOf: meta<ItemOfMeta, string>('itemOf'),
    datetime: meta<DateTimeMeta, string>('datetime'),
    timestamp: meta<TimeStampMeta, number>('timestamp'),
    daterange: meta<DateRangeMeta, string>('daterange'),
}


export type WithKey<Path extends string, T = string> = { [K in Path]: T }

export {
    valueTypes
}
