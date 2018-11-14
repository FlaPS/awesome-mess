import {RouterState} from 'react-router-redux'
import {HistoryState} from './history'
import {ClientState} from './client/'

export type FrontState = ClientState & {
    routing?: RouterState
    history?: HistoryState
}
