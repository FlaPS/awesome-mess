import {CREATED_POSTFIX, isBizAction} from '@local/biz'
import * as moment from 'moment'
import {Action} from 'redux'

export default store => next => (action: Action) => {

    if (isBizAction(action)) {
        if (!action.guid) {
            const creatorUserId = store.getState().credentials.userId
            action.payload.userId = creatorUserId

            if (action.type.endsWith(CREATED_POSTFIX)) {
                if (!action.payload.patch['creatorUserId'] &&
                    !action.payload.patch['creationDate']
                ) {
                    const creatorUserId = store.getState().credentials.userId
                    const creationDate = moment().format()
                    action.payload.patch['creatorUserId'] = creatorUserId
                    action.payload.patch['creationDate'] = creationDate
                }
            }
            return next(action)
        }
    }
    return next(action)
}

