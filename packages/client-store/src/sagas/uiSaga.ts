import {put, race, take} from 'redux-saga/effects'
import * as fsa from '@local/fsa'
import {arrify} from '@local/utils'
import {actions} from '../parts/ui'


export default function* uiSaga() {
    while (true) {
        const confirmRequest = yield take(fsa.isType(actions.confirmDialog))

        const {submit, cancel} = yield race({
            submit: take(fsa.isType(actions.confirmSubmit)),
            cancel: take(fsa.isType(actions.confirmCancel)),
        })

        if (submit) {
            const array = arrify(confirmRequest.payload.action)

            for (let i = 0; i < array.length; i++)
                yield put(array[i])

        }
    }
}
