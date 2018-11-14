import {call} from 'redux-saga/effects'
import {runActor} from '../actor'
import {isType} from '@local/fsa'
import * as path from 'path'
import actions from '../actions'

const logger = console

export default function* pingActor() {
    const actor = yield call(
        runActor,
        path.join(__dirname, 'pongActor.js'),
        false,
        true)

    const task = yield actor.run()
    const data = [{name: 'Joe'}]
    const ping = {type: 'PING', payload: data}
    for (let i = 0; i < 25; i++) {
        yield actor.put()
        logger.log(yield actor.take('PONG'))
    }

    actor.kill()

    const action = yield actor
        .take(isType(actions.disconnected))

    logger.log('CHILD ACTOR disconncted', action)
}
