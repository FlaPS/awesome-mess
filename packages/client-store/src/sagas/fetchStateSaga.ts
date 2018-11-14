import {call, put, select, takeLatest} from 'redux-saga/effects'
import * as conn from '../parts/connection'
import * as biz from '@local/biz'
import axios from 'axios'
import {ClientState} from '../ClientState'

export const defaultHeaders: any = {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/json;charset=UTF-8',
}

export default function* () {

    yield   takeLatest(conn.actions.fetchStateRequested.isType, fetchStateSaga)
}

function* fetchStateSaga() {
    const state: ClientState = yield select()

    try {
        const stateToReset: ClientState =
            yield call(fetchMasterState, state.connection.gateway, state.credentials.login, state.credentials.password)

        yield put(conn.actions.fetchStateSuccess(stateToReset))
        yield put(biz.actions.reset({biz: stateToReset.biz}))
    }
    catch (e) {
        yield put(conn.actions.fetchStateFailed(JSON.stringify(e)))
    }
}


const fetchMasterState = async (gateway: string, login, password): Promise<ClientState> => {
    let url = gateway + '/api/clientState/'

    if (!url.startsWith('http://'))
        url = 'http://' + url

    let result = await <Promise<any>>  axios.post(
        url,
        {
            login,
            password
        },
        {
            headers: Object.assign({}, defaultHeaders),
        }
    )

    return result.data
}
