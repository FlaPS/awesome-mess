import {fork, put, race, select, take, takeLatest} from 'redux-saga/effects'
import {clientSaga, connection as conn, credentials, ui} from '../client/'
import {isType} from '@local/fsa'
import connectionStatusSaga from './connectionStatusSaga'
import {replace} from 'react-router-redux'
import nav from '../../app/nav'
import {actions as iso, PublicMeta} from '@local/isomorphic'


const log = console.info

export const LocalStorageKeys = {
    GATEWAY: 'GATEWAY',
    LOGIN: 'LOGIN',
    PASSWORD: 'PASSWORD',
}


function* initFront() {
    const state = yield select()
    const gateway = state.connection.gateway ||
        localStorage.getItem(LocalStorageKeys.GATEWAY) ||
        window.location.origin ||
        'http://192.168.0.123:8000'

    if (gateway)
        yield put(conn.actions.gatewayChanged(gateway))

    const login = localStorage.getItem(LocalStorageKeys.LOGIN)
    const password = localStorage.getItem(LocalStorageKeys.PASSWORD)

    yield put(ui.actions.busy())
    if (login && password) {
        yield put(credentials.actions.setCredentials({login, password}))

        // not on auth page, do relogin
        if (gateway && !window.location.pathname.includes('auth') && window.location.pathname.length > 4) {
            yield put(conn.actions.gatewayChanged(gateway))

            const {connected, fail} = yield race({
                connected: take(isType(conn.actions.connected)),
                fail: take(conn.actions.failed.isType),
            })

            if (fail) {
                yield put(replace('/auth'))
                yield put(ui.actions.unbusy())
            }
            else {
                yield put(iso.client.authRequest({}))
                const {success, fail} = yield race({
                    success: take(iso.backend.authSuccess.isType),
                    fail: take(iso.backend.authFailed.isType),
                })
                if (fail) {
                    yield put(replace('/auth'))
                    yield put(ui.actions.unbusy())
                }
                else if (window.location.pathname === '/') {
                    yield put(replace(nav.app.access.users.index.path))
                    yield put(ui.actions.unbusy())
                }
            }
        }
        else
            yield put(ui.actions.unbusy())
    } else {
        // go back to login page
        yield put(replace('/auth'))
        yield put(ui.actions.unbusy())
    }


}

function* authSuccessSaga(action) {

    const state = yield select()
    localStorage.setItem(LocalStorageKeys.GATEWAY, state.connection.gateway)
    localStorage.setItem(LocalStorageKeys.LOGIN, state.credentials.login)
    localStorage.setItem(LocalStorageKeys.PASSWORD, state.credentials.password)
    if (window.location.pathname === '/auth' || window.location.pathname === '/')
        yield put(replace(nav.app.access.users.index.path))
}

function* activationSaga() {
    while (true) {
        yield take(iso.backend.publicMeta.isType)
        yield put(ui.actions.unbusy())
        const state = yield select()
        const publicMeta: PublicMeta = state.publicMeta
        yield put(ui.actions.unbusy())
        if (publicMeta.isMaster === false && !publicMeta.activation.activated) {
            if (window.location.pathname !== '/init') {
                yield put(replace('/init'))

            }
            yield take(iso.client.requestActivation.isType)
            yield put(ui.actions.busy())
        }
    }
}

export default function* () {

    yield fork(connectionStatusSaga)
    yield fork(clientSaga)
    yield fork(initFront)
    yield fork(activationSaga)


    yield takeLatest(iso.backend.authSuccess.isType, authSuccessSaga)
}
