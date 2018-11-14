import {actionChannel, put, take} from 'redux-saga/effects'
import {actions as iso} from '@local/isomorphic'
import * as fsa from '@local/fsa'
import eventRepository from '../EventRepository'
import {ServiceConfig} from '../server/restServer'

export default function* (config: ServiceConfig) {

    const channel = yield actionChannel(fsa.isType(iso.client.push))
    const isMaster = config.isMaster
    while (true) {

        const action = yield take(channel)

        for (let i = 0; i < action.payload.length; i++) {
            const event = action.payload[i]
            if (isMaster) {
                event.masterEventId = eventRepository.nextMasterEventId()
                eventRepository.registerMasterEvent(event)
            }
            yield put(event)

        }

        if (isMaster)
            yield put(iso.master.push(action.payload))
        else
            yield put(iso.slave.push(action.payload))

        /*   for (let i = 0; i < action.payload.length; i++) {
               const event = action.payload[i]
               if(!event.type.includes('SERVICE')) {

                   if (sel.config().IS_MASTER) {

                       // let promise work without our control

                       let id = getEventRepository().nextMasterEventId();
                       event.masterEventId = id
                       getEventRepository().registerMasterEvent(event)

                   }
                   else {
                       let sync = getBackendStore().getState().sync
                       event.previousMasterEventId = (sync && sync.masterEventId) ? sync.masterEventId : 0;

                       // let promise work without our control
                       let id = getEventRepository().nextSlaveEventId();

                       event.slaveEventId = id
                       getEventRepository().registerSlaveEvent(event, event.previousMasterEventId)
                   }
               }
               dispatch(event)
           }

           MasterStateRepository.commit(yield select())

           sel.config().IS_MASTER ?
               yield put(act.exchange.masterPush(action.payload))
               :
               yield put(act.exchange.slavePush(action.payload))*/

    }
}

