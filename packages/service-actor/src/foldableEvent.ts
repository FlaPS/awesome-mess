import {getMappingByEventType} from '../../shared/mapping'
import * as _ from 'lodash';
import {ActionEvent} from '../../shared/actionTypes/ActionEvent'

const lastEventsByUsers: ActionEvent[] = []

interface EventFold {
    event: ActionEvent
    foldWithGuid?: string
}

const payloadsAreFoldable = (first: ActionEvent, second: ActionEvent): boolean => {
    let mapping = getMappingByEventType(first.type)
    return mapping &&
        first.key == second.key
}


/**
 * Can we fold two events before insert them into log
 * Suppose to fold events related to single field input
 * @param first
 * @param second
 */
export const areEventsFoldable = (first: ActionEvent, second: ActionEvent): boolean =>
    first.type == second.type &&
    first.userId == second.userId &&
    first.wellId == second.wellId &&
    payloadsAreFoldable(first, second)


export const getEventFold = (event: ActionEvent): EventFold => {
    let previousEvent = lastEventsByUsers[event.userId]

    var foldWithGuid = undefined

    if (previousEvent &&
        areEventsFoldable(previousEvent, event)) {
        foldWithGuid = previousEvent.guid
        event.payload = _.merge(previousEvent.payload, event.payload)
    }

    lastEventsByUsers[event.userId] = event

    return {
        event,
        foldWithGuid
    }
}
