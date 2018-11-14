import masterStateSaver from './masterStateSaver'
import masterState from '../masterState'
import getBackendStore from '../getBackendStore'
import {biz, BizAction, WELL} from '@local/biz'
import {estimate} from '@local/utils'
import {actionChannel, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import * as orm from '@local/rt-orm'
import * as iso from '@local/isomorphic'
import * as fsa from '@local/fsa'
import eventRepository from '../EventRepository'
import {generateGuid} from '@local/random'
import {getLogger} from '@local/logger'
import {ServiceConfig} from '../server/restServer'
import * as keystore from '../keystore'


function* seedState(action) {

    const store = getBackendStore()
    yield put(biz.actions.clearState())

    const config = store.getState().config.backend

    yield call(eventRepository.clearMasterLog)
    const dispatch = (action: BizAction<any>) => {
        action.guid = generateGuid()
        const pushAction = iso.actions.client.push([action])
        return store.dispatch(pushAction)
    }

    estimate(() => biz.seedBiz({...store, dispatch}, action.payload), 'seed')


    const state = store.getState()

    yield call(masterState.saveData, state)
    yield put(iso.actions.backend.seedCompleted())
    /*
    if(config.SYNC_INITIAL_STATE) {
        logger.info('grab state from legacy')
        await connect()
        await grabLegacyData()
        getStore().dispatch({type: CHANGE_SNAPSHOT, payload: uuid() })
    }

    else {
        logger.info('init state from snapshot')
        let state = loadDump()
        let act = require('../../shared/actions/index').act
        getStore().dispatch(act.reset(state))
    }
    */
    yield put(iso.actions.backend.initialized())
}

function* reloadState() {
    const state = yield call(masterState.getData)
    yield put(biz.actions.reset(state))

    const lastMasterEventId = getBackendStore().getState().biz.meta.lastMasterEventId || 0
    const actions = yield call(eventRepository.loadMasterEventsAfter, Number(lastMasterEventId))

    for (let i = 0; i < actions.length; i++)
        getBackendStore().dispatch(actions[i])

    yield put(iso.actions.backend.initialized())
}


const logger = getLogger('orm')

export default function* ormSaga() {

    const channel = yield actionChannel([biz.isBizAction, fsa.isType(biz.actions.reset), fsa.isType(biz.actions.clearState)])

    let state = yield select(state => state)

    while (state.SELECT) {
        logger.log('select is', state.SELECT)
        state = yield select()
    }
    logger.warn('selection success')
    const resetResult = yield call(orm.reset, state)

    while (true) {
        const action = yield take(channel)

        if (fsa.isType(biz.actions.reset)(action) || fsa.isType(biz.actions.clearState)(action))
            yield call(orm.reset, action.payload)

        try {
            if (biz.isBizAction(action)) {
                yield call(orm.update, action)
            }
        } catch (e) {
            logger.error(e)
        }
    }

}

export function* masterSaga(config: ServiceConfig) {

    let state = yield select()

    const seedTask = yield takeEvery(fsa.isType(iso.actions.backend.seed), seedState)
    yield takeEvery(fsa.isType(iso.actions.backend.reloadState), reloadState)

    yield take(fsa.isType(iso.actions.backend.initialized))

    logger.log('seed task is', seedTask)

    if (config.runSeed) {
        yield put(iso.actions.backend.seed(config.seed))

        const completed = yield take(fsa.isType(iso.actions.backend.seedCompleted))

        const state = yield select()
        const wellIds = WELL.asKeys()(state)

        yield call(keystore.createLicenseTable)
        yield call(keystore.seedKeys, wellIds)
    }
    state = yield select()


    const testTask = yield fork(ormSaga)

    yield fork(masterStateSaver)


}
