export * from './array'
export * from './date'
export * from './environment'
export * from './estimate'
export * from './maps'
export * from './trace'
export * from './async'
export * from './getYearsFromSomeToCurrent'

export {default as debug} from './debug'
export {default as capitalize} from './capitalize'
export {default as filterObj} from './filterObj'

export type UnaryFn<A, R> = (value: A) => R

export const cast = <T>(value: any): T => value

export type Arrify<T> = T | T[]

