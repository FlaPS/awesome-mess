import {actionCreatorFactory} from '@local/fsa'
import {actions as iso} from '@local/isomorphic'
import caseReducer from '../caseReducer'
import {ClientState} from '../ClientState'

export interface CredentialsState {
    login?: string
    password?: string
    loggedIn?: boolean
    keepLogin?: boolean
    userId?: string
    error?: string
    snapshotId?: string
    authRequested?: boolean
    autoLogin?: boolean
    wrongCredentials?: boolean
}


const factory = actionCreatorFactory('clientState')

export const actions = {
    setCredentials: factory<{ login?: string, password?: string, autoLogin?: boolean }>('SET_CREDENTIALS'),
}

export const reducer = caseReducer<CredentialsState>(
    {
        loggedIn: false,
        userId: undefined,
    }
)
    .merge(actions.setCredentials,
        (state, {payload}) =>
            ({...payload, keepLogin: false})
    )
    .merge(iso.client.authRequest,
        (state, {payload}) =>
            Object.assign(state, {authRequested: true, wrongCredentials: false, keepLogin: false})
    )
    .merge(iso.client.logout,
        (state, {payload}) =>
            Object.assign(state, {authRequested: true, wrongCredentials: false, keepLogin: false})
    )
    .merge(iso.backend.authSuccess,
        (state, {payload}) =>
            Object.assign(state, {authRequested: false, wrongCredentials: false, keepLogin: true})
    )
    .merge(iso.backend.authFailed,
        (state, {payload}) =>
            Object.assign(state, {authRequested: false, wrongCredentials: true, keepLogin: false})
    )


export const selector = (state: ClientState) => state.credentials