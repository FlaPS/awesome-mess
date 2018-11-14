import {combineReducers, compose, createStore, Store} from 'redux'
import {bizReducer} from '../reducer'
import {defaultBizState, StateWithBiz} from '../BizState'

import {setStore} from '@local/root'
import {identity} from 'ramda'
import {isFrontend} from '@local/utils'

const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'

export const frontReducer = combineReducers({
    biz: bizReducer,
})

export const configureBizTestStore = (initialState: StateWithBiz = {biz: defaultBizState}) => {
    // @ts-ignore
    const store = setStore<FrontState>(createStore(frontReducer, initialState, getFrontEndMeddlewares()))
    //  store['runSaga'] = sagaMiddleware.run
    //   store['runSaga'](frontSaga)
    return store
}

const getFrontEndMeddlewares = () =>
    isFrontend() && window && window[REDUX_DEV_TOOLS] ?
        compose(
            window[REDUX_DEV_TOOLS](),
            identity
        )
        :
        compose(identity)


const store: Store<StateWithBiz> = configureBizTestStore() as any as Store<StateWithBiz>

const dispatch = action => store.dispatch(action)

const getStore = () => store

export default getStore
export {
    getStore,
    dispatch,
}
