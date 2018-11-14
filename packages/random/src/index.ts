import {generate} from 'generate-password'
import * as uuid from 'uuid/v4'
import * as fakerRaw from 'faker'
import * as utils from '@local/utils'
import {keys, omit, pick, values} from 'ramda'
import {AssociativeArray} from '@local/utils/dist/array'

(fakerRaw as any)['locale'] = 'ru'

export const generatePassword = (length: number = 10, withNumbers: boolean = true) => generate({
    length,
    numbers: withNumbers,
})

export const generateGuid = uuid


export const faker = fakerRaw

const uniqufy = <F extends Function>(f: F): F => {
    const cache: any = {}
    const call = (...args) => {
        let result = f(...args)
        if (cache[result] !== undefined) {

            cache[result] = cache[result] + 1
            result += String(cache[result])
        } else
            cache[result] = 0

        return result
    }

    return call as any as F
}

const ap = f => uniqufy(f)

const runAp = (obj: any) => {

    if (typeof obj === 'function')
        return ap(obj)
    else if (typeof obj === 'object') {
        return Object.keys(obj).reduce(
            (result: any, k) => ({...result, [k]: runAp(obj[k])}),
            {}
        )
    }

    return obj
}


export const uniqueFaker = (): typeof faker => {
    const source = omit(['locales'], fakerRaw)
    const result = runAp(source) as any as typeof faker
    return result
}

function shuffleMutate(a) {

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

export const shuffle = <T>(a: T[]): T [] =>
    shuffleMutate([...a])


export const randomInt = (max: number, min: number = 0) => {
    const range = max - min + 1
    return Math.floor(Math.random() * range) + min
}

const takeRandomArray = <T>(max: number = undefined, min: number = 0, array: T[]): T[] => {
    const source = shuffle(array)
    max = typeof max === 'number' ? max : source.length
    const lenght = Math.max(randomInt(max, min), source.length)
    return source.slice(0, max)
}

const takeRandomFormObject = <T>(
    max: number = undefined,
    min: number = 0,
    array: AssociativeArray<T>
): AssociativeArray<T> =>
    pick(takeRandomArray(max, min, Object.keys(array)), array)


export type TakeRandomSourcer<T> = {
    <T>(source: T[]): T[];
    <A>(source: AssociativeArray<T>): AssociativeArray<T>;
}

export const takeRandom = (max: number = undefined, min: number = 0) => <T>(source: T[] | utils.AssociativeArray<T>) =>
    utils.isArray(source)
        ? takeRandomArray(max, min, source)
        : takeRandomFormObject(max, min, source)

export const randomElement = <T>(source: T[] | utils.AssociativeArray<T>): T => {
    const result = takeRandom(1, 1)(source)
    return utils.isArray(source)
        ? result[0]
        : values(result)[0]
}

