import {put, race, select, take, takeLatest} from 'redux-saga/effects'
import {actions as iso} from '@local/isomorphic'
import {ClientState} from '../ClientState'
import * as conn from '../parts/connection'
import {actions as ui} from '../parts/ui'


const logger = console

export default function* () {
    yield takeLatest(iso.client.authRequest.isType, doAuth)
    yield takeLatest(conn.actions.failed.isType, resign)
}

// resign on disconnect if previously was loggedIn
function* resign(action) {
    const connectedAction = yield take(conn.actions.connected)
    const state: ClientState = yield select()
    const creds = state.credentials
    if (creds.keepLogin) {

        yield put(iso.client.authRequest({}))
    }
}

function* doAuth() {

    const state: ClientState = yield select()

    console.log('AUTH: auth requested, make ui busy ')
    //yield put(ui.busy())

    console.log('AUTH: race for ' + iso.backend.authSuccess.type + ' or ' + iso.backend.authFailed.type)


    const {success, fail} = yield race({
        success: take(iso.backend.authSuccess.isType),
        fail: take(iso.backend.authFailed.isType),
    })

    console.log('AUTH: race result is', success, fail)
    logger.log(success, fail)

    if (success) {
        logger.log('authorized, await for logout')

        yield put(conn.actions.fetchStateRequested(''))

        const {success, fail} = yield race({
            success: take(conn.actions.fetchStateSuccess.isType),
            fail: take(conn.actions.fetchStateFailed.isType),
        })

        logger.log('race completed', success, fail)

        if (success) {
            logger.log('Fetch state success')
            yield put(iso.client.subscribe({snapshotId: ''}))

        } else {

            /*   log('could not fetch initial state, return to auth page')
               yield put(act.auth.loginFailed('Could not load initial state'))
               nav.AUTH.open()*/
        }
        yield put(ui.unbusy())
    } else {
        yield put(ui.unbusy())
    }

}