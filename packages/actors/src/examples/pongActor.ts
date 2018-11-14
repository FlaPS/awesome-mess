import {call, take} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {out} from '../actor'
import {getLogger} from '@local/logger'

const logger = getLogger('ACTOR PONG')

export default function* pongActor() {
    yield out({type: 'START'})
    const pong = {type: 'PONG', payload: 'blow'}
    while (true) {
        logger.log('await for ping')

        const action = yield take('PING')

        yield call(delay, 1000)

        yield out(pong)
        logger.log('pong sent back')
    }
}
