import {isFrontend} from '@local/utils'
import {bizReducer as reducer} from './reducer'
import validation, {createSpec} from './core/validation'
import valueTypes from './core/valueTypes'
import pluralize from './pluralize'
import {Scheme} from './core/Scheme'
import {defaultBizState} from './BizState'
import {schemes} from './schemes'
import * as selectors from './selectors/index'

export * from './schemes'
export * from './BizActionCreators'
export * from './actions/BizAction'
export * from './actions/constants'
export * from './core/index'

export * from './Seed'

export * from './core/Scheme'
export * from './sel'
export * from './BizState'

export {
    defaultBizState as defaultState,
    Scheme as EntityScheme,
    reducer,
    validation,
    createSpec,
    valueTypes,
    pluralize
}

export {selectors}

export {ReferenceItemVO} from './references/ReferenceScheme'
export {VO, DateRangeVO} from './core/VO'


export const getScheme = <T>(schemeOrName: string | Scheme<T>): Scheme<T> =>
    typeof schemeOrName === 'string'
        ? schemes[schemeOrName]
        : schemeOrName

if (isFrontend())
    window['selectors'] = selectors
