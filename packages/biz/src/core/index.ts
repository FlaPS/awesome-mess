export * from './valueTypes'
export * from './Scheme'
import {ValueMeta} from './valueTypes'
import * as properties from './properties'
import {Scheme} from './Scheme'
import * as R from 'ramda'

export * from './validation'
export * from './VO'
export * from './KeyBuilder'

export const utils = {
    getSchemeReferences: (scheme: Scheme<any>): Scheme<any>[] =>
        R.filter((meta: ValueMeta) => meta.schemeName !== undefined, R.values(scheme)),
}
export {
    properties,
}
