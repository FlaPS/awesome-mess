import * as fsa from '@local/fsa'
import * as biz from '@local/biz'

const factory = fsa.actionCreatorFactory('sync')

export type SyncMeta = {
    wellId?: string,
    key?: string,
    lastMasterEventId?: string,
    snapshotId?: string,
}

const defaultSyncState = {}

export type SyncSuccessResponse = {
    biz: biz.BizState,
    sync: SyncMeta,
}

export type SyncRequest = SyncMeta

export const selectors = {
    isSyncedAtLeastOnce: (state: { sync: SyncMeta }) =>
        state.sync.snapshotId !== undefined,

}

export const reducer = (state = defaultSyncState, action) => {
    return state
}
export const actions = {
    factory,
    request: factory('requested'),
    success: factory<SyncSuccessResponse>('success'),
    networkError: factory<{ error: any }>('networkError'),
}

