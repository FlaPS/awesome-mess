import {setProduction} from '@local/utils'
import {getLogger} from '@local/logger'
import {backendSaga} from './sagas/backendSaga'
import {cliArgv} from '@local/cli'
import getBackendStore from './getBackendStore'
import * as console from "console"

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.warn('unhandledRejection', error.message);
});
process.on('uncaughtException', error => {
    // Will print "unhandledRejection err is not defined"
    console.warn('uncaughtException', error.message);
});
setProduction(!cliArgv.development)

const logger = getLogger('service')

const store = getBackendStore()
store.runSaga(backendSaga)

// @ts-ignore
export default getBackendStore
