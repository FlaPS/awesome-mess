import * as fsa from '@local/fsa'
import {actions as iso, activation} from '@local/isomorphic'
import WSBack from '../server/WSBack'
import {BackendState} from '../getBackendStore'
import {MiddlewareAPI} from 'redux'

const isBroadcastableAction = (action: fsa.FactoryAnyAction) =>
    fsa.isNamespace(iso.master.factory)(action) ||
    fsa.isNamespace(iso.slave.factory)(action) ||
    fsa.isNamespace(iso.backend.factory)(action) ||
    fsa.isNamespace(activation.actions.factory)(action)


/**
 * Take avery broadcastable event and
 * dispatch one to all connected clients
 */
export default (store: MiddlewareAPI<BackendState>) => {

    return next => action => {
        const result = next(action)
        if (typeof action !== 'function') {
            if (isBroadcastableAction(action))
                WSBack.broadcastAction(action)

        }
        return result
    }
}