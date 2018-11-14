import {biz} from '@local/biz'
import {actionChannel, call, select, take} from 'redux-saga/effects'
import * as fsa from '@local/fsa'
import * as api from './api'
import {getLogger} from '@local/logger'

const logger = getLogger('orm')

export default function* () {

    const isOrmAction = action => biz.isBizAction(action) || fsa.isType(biz.actions.reset)(action)
    const chan = yield actionChannel(isOrmAction)

    const state = yield select()
    yield call(api.reset, state)
    console.log('ORM listening')
    while (true) {

        const action = yield take(chan)

        if (fsa.isType(biz.actions.reset)(action))
            yield call(api.reset, action.payload)

        try {
            if (biz.isBizAction(action)) {
                yield call(api.update, action)
            }
        } catch (e) {
            logger.error(e)
        }
    }
}
