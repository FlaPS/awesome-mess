import * as fsa from '@local/fsa/'
import caseReducer from '../caseReducer'
import {Action, combineReducers} from 'redux'
import {ClientState} from '../ClientState'

export type ConfirmDialogState = {
    action: Action | Action[]
    submitText: string
    cancelText: string
    title: string
    text?: string
    list?: string[]
}

export type UIState = {
    snackbar: {
        text?: string
    }
    busy?: boolean
    confirmDialog: ConfirmDialogState
}


const factory = fsa.actionCreatorFactory('ui')

export const actions = {
    factory,
    showMessage: factory<string>('showMessage'),
    hideMessage: factory('hideMessage'),
    reject: factory('reject'),
    aks: factory('ask'),
    busy: factory('busy'),
    unbusy: factory('unbusy'),

    confirmDialog: factory<ConfirmDialogState>('confirmDialog'),
    confirmSubmit: factory('confirmSubmit'),
    confirmCancel: factory('confirmCancel'),
}

const snackbar = caseReducer<any>(
    {
        text: undefined,
    }
)
    .merge(actions.showMessage,
        (state, {payload}) =>
            ({text: payload})
    )
    .merge(actions.hideMessage,
        (state, {payload}) =>
            ({text: undefined})
    )
    .merge(actions.reject,
        (state, {payload}) =>
            ({text: undefined})
    )

const busy = (state = false, action) => {
    if (fsa.isType(actions.busy)(action))
        return true
    if (fsa.isType(actions.unbusy)(action))
        return false

    return state
}

const confirmDialog = fsa
    .reducerWithInitialState<Partial<ConfirmDialogState>>({})
    .case(actions.confirmDialog, (state, payload) => payload)
    .case(actions.confirmCancel, state => ({}))
    .case(actions.confirmSubmit, state => ({}))

export const selector = (state: ClientState) => state.ui

export const reducer = combineReducers({
    snackbar,
    busy,
    confirmDialog,
})

