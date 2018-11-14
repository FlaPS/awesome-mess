import {WSFront} from './WSFront'
import {eventChannel} from 'redux-saga';
import * as fsa from '@local/fsa'
import {actions as iso} from '@local/isomorphic'
import {actions as conn} from '../parts/connection'
import {actionChannel, fork, put, select, take, takeLatest} from 'redux-saga/effects'

export default function* () {

    const ws = new WSFront()
    yield takeLatest(conn.gatewayChanged.isType, reconnectSocket, ws)
    yield fork(readWorker, ws)
    yield fork(writeWorker, ws)
}


function* reconnectSocket(ws: WSFront, action: typeof conn.gatewayChanged.example) {
    ws.connect(action.payload)
}

function* readWorker(ws: WSFront) {
    const channel = eventChannel(emit => {
        ws.dispatch = emit
        return ws.dispose
    })

    while (true) {
        const action = yield take(channel)
        yield put(action)
    }
}


function* writeWorker(ws: WSFront) {
    const channel = yield actionChannel(
        fsa.isNamespace(iso.client.factory)
    )

    while (true) {
        const action = yield take(channel)
        if (fsa.isType(iso.client.authRequest)(action)) {
            const credentials = (yield select()).credentials
            if (ws.connected)
                ws.send({...action, payload: credentials})
        }
        else if (ws.connected)
            ws.send(action)
    }
}


