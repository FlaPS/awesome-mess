import {ServiceConfig} from '../server/restServer'
import * as iso from '@local/isomorphic'
import {call, put, take} from 'redux-saga/effects'

export default function* activationSaga(config: ServiceConfig) {
    yield put(iso.actions.activation.activationFailed('new'))
    while (true) {
        const {payload} = yield take(iso.actions.client.requestActivation)
        yield put(iso.activation.actions.requested(payload))
        const api = iso.slaveRestClient(payload.masterAddress)
        const result: iso.activation.ActivationResponse = yield call(api.activate, payload)
        if (result.status === 'success') {
            yield put(iso.activation.actions.success(result))
            break
        }
        else if (result.status === 'fail')
            yield put(iso.activation.actions.failed(result))


    }
}