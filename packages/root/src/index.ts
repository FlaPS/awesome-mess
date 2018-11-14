import {Store} from 'redux'

/**
 * Root object of the app
 * @type {boolean | Window | NodeJS.Global | any}
 */
const root =    (typeof self === 'object' && self.self === self && self)
            ||  (typeof global === 'object' && global.global === global && global)
            ||   this

const setKey = <T>(key: string, value: T): T =>
    root[key] = value


const getKey = <T>(key: string): T =>
    root[key]

const getStore = <State>() => getKey<Store<State>>('redux')

const setStore = <State>(store: Store<State>) =>
    setKey('redux', store)


export {
    getStore,
    setStore,
    getKey,
    setKey
}
