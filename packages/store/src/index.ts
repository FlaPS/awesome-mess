import {setProduction} from '@local/utils'
import './fileTransport'
import {getLogger} from '@local/logger'
import {getStore, sagaMiddleware} from '../shared/configureStore'
import {backendSaga} from './sagas/backendSaga'
import {cliArgv} from '@local/cli'

setProduction(!cliArgv.development)

const logger = getLogger('service')

getStore().runSaga(backendSaga)

export default getStore
