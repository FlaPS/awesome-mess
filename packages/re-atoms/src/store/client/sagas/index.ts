import exchangeSaga from './exchangeSaga'
import {fork} from 'redux-saga/effects'
import ioSaga from './ioSaga'

import fetchStateSaga from './fetchStateSaga'
import uiSaga from './uiSaga'
import authSaga from './authSaga'

export default function* () {
    yield fork(authSaga)
    yield fork(fetchStateSaga)
    yield fork(exchangeSaga)
    yield fork(ioSaga)
    yield fork(uiSaga)
}