import * as fsa from '@local/fsa'
import {ClientState} from '../ClientState'

const factory = fsa.actionCreatorFactory('connection')

export const actions = {
    factory,
    connected: factory('CONNECTED'),
    disconnected: factory('DISCONNECTED'),
    error: factory<string>('ERROR'),
    failed: factory<string>('FAILED'),
    gatewayChanged: factory<string>('GATEWAY_CHANGED'),
    fetchStateRequested: factory<string>('FETCH_STATE_REQUESTED'),
    fetchStateSuccess: factory<ClientState>('FETCH_STATE_SUCCESS'),
    fetchStateFailed: factory<string>('FETCH_STATE_FAILED'),
}


/**
 * Describes the connection information
 */
export interface ConnectionState {
    isConnected?: boolean
    gateway?: string
    error?: string
    doReconnect?: boolean

    /**
     * is credentials connected to master ?
     */
    isMaster?: boolean
}

export const reducer = (state: ConnectionState = {isConnected: false}, action) => {

    if (fsa.isType(actions.connected)(action))
        return {...state, isConnected: true, error: undefined}

    else if (fsa.isType(actions.disconnected)(action))
        return {...state, isConnected: false}

    else if (fsa.isType(actions.error)(action))
        return {...state, error: action.payload, isConnected: false}

    else if (fsa.isType(actions.gatewayChanged)(action))
        return {...state, gateway: action.payload, error: undefined, isConnected: false}

    return state
}
export const selector = (state: ClientState) => state.connection