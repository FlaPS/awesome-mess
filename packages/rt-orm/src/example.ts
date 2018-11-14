import * as api from './api'
import {generateAction} from './seed/seedRefs'
import biz from '@local/biz'
import createSagaMiddleware from 'redux-saga'
import {applyMiddleware, combineReducers, compose, createStore, Reducer, Store} from 'redux'
import {setStore} from '@local/root'


export type BackendState = {
    biz: biz.BizState
    config: {
        backend: BackendConfig
    }
}

export type BackendConfig = {}


const sagaMiddleware = createSagaMiddleware()

const defaultState: BackendState = {
    biz: biz.defaultState,
    config: {
        backend: {},
    },
}


const reducer = combineReducers({
    biz: biz.reducer,
    config: (cfg = {}) => cfg,
})

let store: Store<BackendState> & { runSaga(saga: any, ...args): any }

const configureStore = (initialState: BackendState = defaultState) => {
    store = Object.assign(createStore<BackendState>(
        reducer as any as Reducer<BackendState>,
        initialState,
        compose(
            applyMiddleware(sagaMiddleware)
        )),
        {runSaga: sagaMiddleware.run}
    )
    setStore(store)
    return store
}

export type BackendStore = typeof store

const getStore = (initialState: BackendState = defaultState) =>
    (store || (configureStore(initialState)))


const run = async () => {
    biz.seedBiz(getStore())

    const state = getStore().getState()
    await api.reset(state)

    const actions = []
    for (let i = 0; i < 11; i++)
        actions.push(generateAction())

    //  console.log(actions)

    for (let i = 0; i < actions.length; i++)
        await api.update(actions[i])
}

run()
