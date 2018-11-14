import {BackendState} from '../getBackendStore'

export default (state: BackendState, userId: string): Partial<BackendState> =>
    state
