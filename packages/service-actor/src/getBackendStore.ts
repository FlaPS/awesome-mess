import broadcastMiddleware from './middlewares/broadcastMiddleware'
import biz from '@local/biz'
import createSagaMiddleware from 'redux-saga'
import {applyMiddleware, combineReducers, compose, createStore, Reducer, Store} from 'redux'
import * as fsa from '@local/fsa'
import {isProduction} from '@local/utils'
import {composeWithDevTools} from 'remote-redux-devtools'
import {setStore} from '@local/root'
import validationMiddleware from './middlewares/validationMiddleware'
import {saveModificationMiddleware} from './middlewares/saveModificationDate'
import * as iso from '@local/isomorphic'
import {defaults, PublicMeta, reducers} from '@local/isomorphic'


const remoteDevToolsConfig = {realtime: true}
const composeEnhancers = composeWithDevTools(remoteDevToolsConfig)

export type BackendState = {
    biz: biz.BizState
    config: {
        backend: BackendConfig
    }
    publicMeta: PublicMeta
    activation: iso.activation.ActivationState
}

export type BackendConfig = {}


const defaultState: BackendState = {
    biz: biz.defaultState,
    config: {
        backend: {},
    },
    publicMeta: defaults.publicMeta,
    activation: iso.activation.defaultActivationState,
}

const factory = fsa.actionCreatorFactory('service')

const reducer = combineReducers({
    biz: biz.reducer,
    config: (cfg = {}, action) =>
        cfg,
    publicMeta: reducers.publicMeta,
    activation: iso.activation.reducer,
    sync: iso.sync.reducer,
})

let store: Store<BackendState> & { runSaga(saga: any, ...args): any }

const getBackendComposer = () =>
    isProduction()
        ? compose
        : composeEnhancers

const configureStore = (initialState: BackendState = defaultState) => {
    const sagaMiddleware = createSagaMiddleware()
    store = Object.assign(createStore<BackendState>(
        reducer as any as Reducer<BackendState>,
        initialState,
        compose(
            applyMiddleware(sagaMiddleware),
            applyMiddleware(broadcastMiddleware),
            applyMiddleware(saveModificationMiddleware),
            applyMiddleware(validationMiddleware),
        )
        ),
    )
    store.runSaga = sagaMiddleware.run
    setStore(store)
    return store
}

export type BackendStore = typeof store

export default (initialState: BackendState = defaultState): typeof store => {

    return (store || (configureStore(initialState)))
}

