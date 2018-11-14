import {applyMiddleware, combineReducers, compose, createStore, Store} from 'redux'
import createHistory from 'history/createBrowserHistory'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import {FrontState} from './FrontState'

import {bizMiddleware, reducers, saveModificationMiddleware} from './client/'
import {getStore, setStore} from '@local/root'
import frontSaga from './sagas/frontSaga'
import createSagaMiddleware from 'redux-saga'
import * as history from './history'
import {isFrontend} from '@local/utils'

const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'

export const frontReducer = combineReducers({
    ...reducers,
    history: history.reducer,
    routing: routerReducer,
})

export const configureFrontendStore = (initialState?: FrontState) => {
    // @ts-ignore
    const store = setStore<FrontState>(createStore(frontReducer, initialState, getFrontEndMiddlewares()))

    const frontConfig = store.getState().frontConfig

    /*if (frontConfig.env === 'storybook')
         biz.seedBiz(store)
    else {*/
    store['runSaga'] = sagaMiddleware.run
    store['runSaga'](frontSaga)
    //}
    return store as Store<FrontState> & { runSaga: Function }
}
export const browserHistory = createHistory()

const sagaMiddleware = createSagaMiddleware()
const router = routerMiddleware(browserHistory)

const getFrontEndMiddlewares = () =>
    isFrontend() && window[REDUX_DEV_TOOLS] ?
        compose(
            applyMiddleware(sagaMiddleware),
            applyMiddleware(router),
            applyMiddleware(history.middleware),
            // @ts-ignore
            applyMiddleware(saveModificationMiddleware),
            applyMiddleware(bizMiddleware),
            window[REDUX_DEV_TOOLS]()
        )
        :
        compose(
            applyMiddleware(sagaMiddleware),
            applyMiddleware(router),
            applyMiddleware(history.middleware),
            // @ts-ignore

            applyMiddleware(saveModificationMiddleware),
            applyMiddleware(bizMiddleware)
        )


const store: Store<FrontState> = configureFrontendStore() as any as Store<FrontState>

const dispatch = action => store.dispatch(action)


export {
    getStore,
    dispatch,
}
