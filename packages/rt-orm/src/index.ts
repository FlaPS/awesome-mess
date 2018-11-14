import * as api from './api'
import {actionChannel, call, select, take} from 'redux-saga/effects'
import * as biz from '@local/biz'
import * as fsa from '@local/fsa'

export const reset = api.reset
export const update = api.update

const logger = console//('orm')

export function* ormSaga() {

    const channel = yield actionChannel([biz.isBizAction, fsa.isType(biz.actions.reset)])

    const eff = select()
    logger.log('eff is', JSON.stringify(eff))
    const state = yield eff

    logger.log('state is', JSON.stringify(state))

    logger.warn('selection success')
    const resetResult = yield call(reset, state)

    while (true) {
        const action = yield take(channel)

        if (fsa.isType(biz.actions.reset)(action))
            yield call(reset, action.payload)

        try {
            if (biz.isBizAction(action)) {
                yield call(update, action)
            }
        } catch (e) {
            logger.error(e)
        }
    }

}