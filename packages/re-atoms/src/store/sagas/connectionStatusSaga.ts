import {race, select, take} from 'redux-saga/effects'
import {FrontState} from '../FrontState'
import {anyPass} from 'ramda'
import {connection} from '../client/'
import {isType} from '@local/fsa'
import {LocalStorageKeys} from './frontSaga'

const {actions} = connection

export default function* connectionStatusSaga() {

    while (true) {
        yield take(anyPass([isType(actions.gatewayChanged), isType(actions.error)]))
        const hide = console.log('Соединение с сервером', 0)

        let {connected, changed, disconnected} = yield race({
            connected: take(isType(actions.connected)),
            changed: take(isType(actions.gatewayChanged)),
            disconnected: take(isType(actions.disconnected)),
        })

        //hide()

        if (connected) {
            console.log("Соединение установлено")
            let state: FrontState = yield select()
            localStorage.setItem(LocalStorageKeys.GATEWAY, state.connection.gateway)
        }
    }
}
