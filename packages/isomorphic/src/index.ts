import {Action} from 'redux'
import * as isoActions from './actions'
import {PublicMeta} from './actions'

import {isType} from '@local/fsa'

import * as sync from './sync'
import * as activation from './activation'

export {default as slaveRestClient} from './slaveRestClient'

export {
    PublicMeta,
    sync,
    activation,
}

export const reducers = {
    publicMeta: (state: PublicMeta = defaults.publicMeta, action) => {
        if (isType(isoActions.backend.publicMeta)(action))
            return {...state, ...action.payload}
        return state
    },
}

export const defaults = {
    publicMeta: {
        isMaster: true,
        name: 'Центральный сервер',
        version: '0.0.12',
        activation: {},
    } as PublicMeta,
}

export type PushAction = {
    type: string
    payload: Action []
}

export const actions = isoActions
