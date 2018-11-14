import * as f from './configureStore'
import {Store} from 'redux'
import {FrontState} from './FrontState'

export default (): Store<FrontState> => f.getStore() as any as Store<FrontState> & { runSaga: (saga: any, ...rest) => any }
