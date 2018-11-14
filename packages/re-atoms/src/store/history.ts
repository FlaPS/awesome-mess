import * as fsa from '@local/fsa'

export const factory = fsa.actionCreatorFactory('history')
export const PUSH_POSTFIX = 'PUSH'
export const POP_POSTFIX = 'POP'

export type HistoryState = {
    appHistory: Array<string>
}

export const actions = {
    push: factory<string>(PUSH_POSTFIX),
    pop: factory(POP_POSTFIX),
}

const defaultState: HistoryState = {
    appHistory: [],
}

export const reducer = (state: HistoryState = defaultState, action: fsa.FactoryAction<any>) => {

    if (fsa.isType(actions.push)(action)) {
        const locations = state.appHistory
        locations.push(action.payload)
        return {appHistory: locations}
    }
    if (fsa.isType(actions.pop)(action)) {
        const newlocations = state.appHistory
        newlocations.pop()
        newlocations.pop()
        return {appHistory: newlocations}
    }
    return state

}


export const middleware = store => next => action => {
    if (action.type === '@@router/LOCATION_CHANGE' && action.payload)
        store.dispatch(actions.push(action.payload.pathname))
    return next(action)
}

