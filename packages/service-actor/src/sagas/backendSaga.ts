import {call, fork, put, takeLatest} from 'redux-saga/effects'
import {masterSaga} from '../master/masterSaga'
import startHTTPServer, {defaultServiceConfig, ServiceConfig} from '../server/restServer'
import configurable from '@local/config'
import clientPullSaga from './clientPullSaga'
import * as iso from '@local/isomorphic'
import {serviceConfigFileName} from '../constants'
import getBackendStore from '../getBackendStore'
import * as fsa from '@local/fsa'
import {FactoryAction} from '@local/fsa'
import slaveSaga from '../slave/slaveSaga'


const logger = console

const factory = fsa.actionCreatorFactory('service')

const actions = {
    reconfigure: factory<ServiceConfig>('reconfigure'),
}

const dispatchReconfigure = (value: ServiceConfig) =>
    getBackendStore().dispatch(actions.reconfigure(value))

const configurator = configurable(serviceConfigFileName)(dispatchReconfigure)


function* reconfigureSaga(action: FactoryAction<ServiceConfig>) {
    try {

        const config = action.payload
        yield call(startHTTPServer, config)

        logger.log('service succesfully launched', config)
        config.isMaster
            ? yield fork(masterSaga, config)
            : yield fork(slaveSaga, config)

        yield fork(clientPullSaga, config)
        yield put(iso.actions.backend.initialized())
        logger.log('backend store configured')
    } catch (e) {
        logger.error(' Error while initialization', e)
    }
}

export function* backendSaga(config?: ServiceConfig) {

    // manually launch with a config
    if (config) {
        yield fork(reconfigureSaga, {payload: config})
    }
    // read config and watch for config file changes
    else {
        // @ts-ignore
        yield takeLatest(fsa.isType(actions.reconfigure), reconfigureSaga)

        configurator(defaultServiceConfig)
    }
}
