import getKnex from './knexConnection'
import {sleep} from '@local/utils'
import {getLogger} from '@local/logger'

const masterEventsTable = 'master_events'
const slaveEventsTable = 'slave_events'

const logger = getLogger('EventStore')

export type ActionEvent = {
    type: string
    payload: any
    guid?: string
    masterEventId?: number
    slaveEventId?: number
    slaveId?: number

    meta?: {
        destination?: string
        notification?: string
    }
    time: number
    userId?: any
    wellId?: any
    key?: any

}

export class EventRepository {

    currentMasterEventId = 1

    nextMasterEventId = () =>
        this.currentMasterEventId += 1


    currentSlaveEventId = 1

    nextSlaveEventId = () =>
        this.currentSlaveEventId += 1


    initialize = async () => {

        logger.info('initialize knex')
        const knex = await getKnex()
        const result = await knex('master_events').select().orderByRaw(' masterEventId DESC').limit(1)
        if (result.length)
            this.currentMasterEventId = result[0].masterEventId

        else
            this.currentMasterEventId = 1
        /*    if (!config.IS_MASTER) {
                var result = await knex('slave_events').select().orderByRaw(' slaveEventId DESC').limit(1)
                if (result.length)
                    this.currentSlaveEventId = result[0].slaveEventId
            }*/
        this.runQueue()
    }

    slaveInsertQueue: ActionEvent[] = []

    masterInsertQueue: ActionEvent[] = []

    runQueue = async () => {

        while (true) {
            await this.insertPart()


            await sleep(50)
        }
    }

    insertPart = async () => {
        const knex = await getKnex()
        if (this.slaveInsertQueue.length) {
            const copy = this.slaveInsertQueue.concat()
            this.slaveInsertQueue.length = 0
            await knex('slave_events').insert(
                copy
            )
        }

        if (this.masterInsertQueue.length) {
            // slice only one 1000 rows and await for insert
            const part = this.masterInsertQueue.slice(0, 100)
            const sql = this.getInsertMasterEventsSQL(part)

            this.masterInsertQueue = this.masterInsertQueue.slice(part.length)
            logger.debug('Insert new events', sql)
            await knex.raw(sql)
        }
    }


    clearMasterLog = async () => {
        const knex = await getKnex()
        await knex.raw('truncate table master_events');
    }

    getInsertMasterEventsSQL = (array: ActionEvent[]) => {
        let sql = 'INSERT INTO master_events (masterEventId, guid, type, time, userId, wellId, `key`, payload) VALUES '
        const quant = array.length
        const last = quant - 1

        for (let i = 0; i < quant; i++) {

            const e = array[i]
            const payload = e.payload ? ("'" + JSON.stringify(e.payload) + "'") : 'NULL'
            const userId = e.userId ? e.userId : 'NULL'
            const wellId = e.wellId ? e.wellId : 'NULL'
            const key = e.key ? ('"' + e.key + '"') : 'NULL'
            sql += '(' + e.masterEventId + ", '"
                + e.guid + "', '"
                + e.type + "', "
                + e.time + ', '
                + userId + ', '
                + wellId + ', '
                + key + ', '
                + payload + ')'

            sql += i === last ? ';' : ','
        }

        return sql
    }


    loadMasterEventsAfter = async (
        startId: number,
        endId: number = Number.MAX_VALUE,
        context: string = undefined): Promise<ActionEvent[]> => {
        startId = Number(startId)
        endId = Number(endId)
        let events: ActionEvent[] = []

        const knex = await getKnex()
        if (isNaN(startId))
            return []

        if (!context)
            events = await knex(masterEventsTable)
                .select()
                .whereRaw('masterEventId > ? AND masterEventId <= ?', [startId, endId])
                .orderByRaw('masterEventId')
        else
            events = await knex.select()
                .whereRaw('masterEventId > ? AND masterEventId <= ? AND (wellId = ? OR wellId is NULL)', [startId, endId, context])
                .orderByRaw('masterEventId')
                .from(masterEventsTable)

        for (let i = 0; i < events.length; i++)
            events[i].payload = JSON.parse(events[i].payload as any as string)

        return events
    }

    loadSlaveEventsAfter = async (
        startId: number,
        endId: number = Number.MAX_VALUE,
        context: string = undefined): Promise<ActionEvent[]> => {
        startId = Number(startId)
        endId = Number(endId)
        let events: ActionEvent[] = []
        const knex = await getKnex()
        if (isNaN(startId))
            return []

        if (!context)
            events = await knex(slaveEventsTable)
                .select()
                .where('slaveEventId', '>', startId)
        else
            events = await knex
                .select()
                .whereRaw('slaveEventId > ? AND slaveEventId <= ? AND (wellId = ? OR wellId is NULL)', [startId, endId, context])
                .orderByRaw('slaveEventId')
                .from(slaveEventsTable);

        for (let i = 0; i < events.length; i++)
            events[i].payload = JSON.parse(events[i].payload as any as string)

        return events
    }

    loadSlaveEventsForMasterId = async (previousMasterId: number): Promise<ActionEvent[]> => {
        previousMasterId = Number(previousMasterId)
        const knex = await getKnex()
        if (isNaN(previousMasterId))
            return []

        const events: ActionEvent[] = await knex
            .select()
            .whereRaw('previousMasterEventId >= ?', [previousMasterId])
            .orderByRaw('slaveEventId')
            .from(slaveEventsTable)

        for (let i = 0; i < events.length; i++)
            events[i].payload = JSON.parse(events[i].payload as any as string)

        return events
    }
    /*

        syncForMasterEvents = async(store: Store<ReportingState>) => {
            logger.info('sync for events')

            const sync = store.getState().sync
            const lastmasterEventId = (sync && sync.masterEventId) ? sync.masterEventId : 0;
            const events: ActionEvent[] = await getKnex().select().where('masterEventId', '>', lastmasterEventId).orderByRaw('masterEventId').from(masterEventsTable);

            for (let i = 0; i < events.length; i++) {
                events[i].payload = JSON.parse(events[i].payload)

                store.dispatch(events[i]);
                logger.debug('dispatch for event', JSON.stringify(events[i]))
            }

            console.log('sync for events completed')
        }


        syncForSlaveEvents = async(store: Store<ReportingState>) => {
            logger.info('sync for events')

            const sync = store.getState().sync
            const lastId = (sync && sync.slaveEventId) ? sync.slaveEventId : 0;
            const events: ActionEvent[] = await getKnex()
                .select()
                .where('slaveEventId', '>', lastId)
                .orderByRaw('slaveEventId')
                .from(slaveEventsTable);

            for (let i = 0; i < events.length; i++) {
                events[i].payload = JSON.parse(events[i].payload)
                store.dispatch(events[i])
                logger.debug('dispatch for event', JSON.stringify(events[i]))
            }

            logger.info('sync for events completed')
        }
    */

    registerMasterEvent = (newEvent: ActionEvent) => {

        const event = newEvent
        //   let {event, foldWithGuid} =  getEventFold(newEvent);

        /* if (foldWithGuid)
             await getKnex()('master_events').where('guid', foldWithGuid).delete()
 */
        event.time = new Date().getTime()
        this.masterInsertQueue.push(event)

    }

    /*
        registerSlaveEvent = (newEvent: ActionEvent, masterEventId: number)=> {
            const {event, foldWithGuid} =  getEventFold(newEvent)

            if (foldWithGuid)
                await getKnex()('slave_events').where('guid', foldWithGuid).delete()

            return new Promise<number>((resolve, reject) =>
                getKnex().insert(
                    {
                        slaveEventId: event.slaveEventId,
                        previousMasterEventId: masterEventId,
                        wellId: event.wellId,
                        userId: event.userId,
                        time: new Date().getTime(),
                        type: event.type,
                        key: event.key,
                        payload: JSON.stringify(event.payload),
                        guid: event.guid,
                    }
                )
                    .into('slave_events')
                    .then(id => resolve(id[0]))
                    .catch(e => reject(e))
            )
        }
    */

    recordMasterEvent = (action: ActionEvent) => {
        logger.log('record event', action)
        this.slaveInsertQueue.push(
            {
                masterEventId: action.masterEventId,
                wellId: action.wellId,
                userId: action.userId,
                time: new Date().getTime(),
                type: action.type,
                key: action.key,
                payload: JSON.stringify(action.payload),
                guid: action.guid,
            }
        )
    }

}

const eventRepository: EventRepository = new EventRepository()

eventRepository.initialize()

export default eventRepository
