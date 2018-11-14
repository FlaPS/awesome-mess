import {CREATED_POSTFIX, isBizAction, schemes} from '@local/biz'
import * as fsa from '@local/fsa'
import * as Moment from 'moment'

export const saveModificationMiddleware = store => next => action => {
    if (isBizAction(action)) {
        const schemeName = action.type.split(fsa.factoryDelimeter)[1]
        const schemeProps = schemes[schemeName].properties


        Object.keys(schemeProps)
            .forEach(prop => {
                try {
                    if (action.payload.patch[prop] &&
                        schemeProps[prop].saveModificationDate &&
                        !action.type.endsWith(CREATED_POSTFIX)) {
                        const modificatedPropName = `${prop}_modificated`
                        const userId = store.getState().credentials ? store.getState().credentials.userId : undefined
                        action.payload.patch[modificatedPropName] = {}
                        action.payload.patch[modificatedPropName].userId = userId
                        action.payload.patch[modificatedPropName].modificationDate = Moment.now()
                    }
                } catch (e) {

                }
            })
    }
    return next(action)
}
