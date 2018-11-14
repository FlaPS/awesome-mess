import {ServiceConfig} from '../server/restServer'
import {put, takeEvery} from 'redux-saga/effects'
import * as fsa from '@local/fsa'
import * as iso from '@local/isomorphic'
import reloadSlaveStateState from './reloadSlaveStateSaga'
//import slaveServiceSaga from './slaveServiceSaga'
import activationSaga from './actiovationSaga'


export default function* slaveSaga(config: ServiceConfig) {

    //yield fork(slaveServiceSaga, config)

    yield put(iso.actions.backend.publicMeta({isMaster: false}))
    yield takeEvery(fsa.isType(iso.actions.backend.reloadState), reloadSlaveStateState)
    if (!config.slaveKey) {
        yield put(iso.actions.backend.publicMeta({name: 'Новая буровая'}))
        yield* activationSaga(config)
    }

    yield put(iso.actions.backend.reloadState())
}
