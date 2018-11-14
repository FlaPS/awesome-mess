import * as history from './history'
import {FrontState} from './FrontState'
import getFrontendStore from './getFrontendStore'
import {browserHistory, dispatch, frontReducer} from './configureStore'

export * from './client/'

export {
    history,
    dispatch,
    FrontState,
    frontReducer,
    getFrontendStore,
    browserHistory
}


export default getFrontendStore
