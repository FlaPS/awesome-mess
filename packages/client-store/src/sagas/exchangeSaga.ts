import * as fsa from '@local/fsa'
import * as biz from '@local/biz'
import {actions as iso, PushAction} from '@local/isomorphic'
import {actionChannel, flush, fork, put, select, take} from 'redux-saga/effects'
import * as rand from '@local/random'
import {Action} from 'redux'
import * as ui from '../parts/ui'

const factory = fsa.actionCreatorFactory('approve')

const knownActionGuids: string[] = []

const isUnknownBizAction = (action: Action) =>
    biz.isBizAction(action) &&
    !knownActionGuids.includes(action.guid)

const isNewBizAction = action =>
    biz.isBizAction(action) && action.guid === undefined

function* clientPush() {

    let action: biz.BizAction<any>
    yield take(fsa.isType(biz.actions.reset))
    while (true) {
        const state = yield select()

        action = yield take(isNewBizAction)

        yield put(
            ui.actions.showMessage(
                biz.getShortMessage(action)
            )
        )
        const channel = yield actionChannel(a => biz.isBizAction(a) && a.guid !== undefined)
        /*const {
            newAction,
            approve,
            reject,
        } = yield race({
            newAction: s.take(a => biz.isBizAction(a) && a.guid === undefined),
            approve: call(delay, 10000),
            reject: s.take(fsa.isType(ui.actions.reject)),
        })*/

        const actions = yield flush(channel)
        if (true /*newAction || approve*/) {
            const guid = rand.generateGuid()
            knownActionGuids.push(guid)
            const push = [{...action, guid}]

            yield put(ui.actions.hideMessage())
            yield put(iso.client.push(push))
        } else {
            // @ts-ignore
            yield put(biz.actions.reset(state))

            for (let i = 0; i < actions.length; i++)
                yield put(actions[i])
        }

    }
}


function* masterPull() {
    const channel = yield actionChannel(fsa.isNamespace(iso.master))

    while (true) {
        const action: PushAction = yield take(channel)

        if (action.payload) {
            for (let i = 0; i < action.payload.length; i++) {
                console.log('recieve event from master', action.payload)
                const event = action.payload[i]
                if (isUnknownBizAction(event))
                    yield put(event)
            }
        }
    }
}

export default function* () {
    yield fork(clientPush)
    yield fork(masterPull)
}
