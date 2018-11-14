import * as fd from '@local/file-data'
import * as biz from '@local/biz'
import {call, put} from 'redux-saga/effects'
import * as iso from '@local/isomorphic'
import getBackendStore from '../getBackendStore'

export const slaveStateRepository = fd.fileDataRepository<{ biz: biz.BizState }>('slaveState.json')

export default function* reloadSlaveStateState() {
    const state = yield call(slaveStateRepository.getData)
    yield put(biz.actions.reset(state))

    const lastMasterEventId = getBackendStore().getState().biz.meta.lastMasterEventId || 0
    // const actions = yield call(eventRepository.loadMasterEventsAfter, Number(lastMasterEventId))

    /*
        for (let i = 0; i < actions.length; i ++)
            getBackendStore().dispatch(actions[i])
    */

    yield put(iso.actions.backend.initialized())
}