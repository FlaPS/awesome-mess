import {call, select, throttle} from 'redux-saga/effects'
import * as biz from '@local/biz'
import masterState from '../masterState'

function* handleSave(input) {
    const state = yield select()
    yield call(masterState.saveData, state)
}

export default function* () {
    yield throttle(
        60000,
        (action: biz.BizAction<any>) =>
            action.type.startsWith(biz.BIZ_PREFIX) && action.masterEventId !== undefined,
        handleSave
    )
}