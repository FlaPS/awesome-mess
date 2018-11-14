import {merge, over} from 'ramda'
import {BizState} from './BizState'
import {actions, BIZ_PREFIX, POPULATED_POSTFIX} from './BizActionCreators'
import {Scheme} from './core/Scheme'
import {schemes} from './schemes'
import {isType} from '@local/fsa'
import {defaultBizState} from './index'
import {reducer as reduceRigs} from './Rig'
import {BizAction} from './actions/BizAction'


export const bizReducer = <T>(state: BizState = defaultBizState, action: BizAction<T>) => {

    const newRigs = reduceRigs(state.rigId, action)

    if (newRigs !== state.rigId)
        state = {...state, rigId: newRigs}

    if (isType(actions.reset)(action))
        return action.payload.biz

    else if (isType(actions.clearState)(action))
        return defaultBizState

    else if (isType(actions.setStateGUID)(action)) {
        return {...state, meta: {...state.meta, stateGUID: action.payload}}
    } else if (action.type.startsWith(BIZ_PREFIX)) {
        const schemeName = action.type.split('/')[1]
        const scheme: Scheme<T> = schemes[schemeName]

        if (action.payload && scheme) {

            const mutate = id => {
                const itemLens = scheme.keyBuilder.getLens(id)
                let spec = scheme.keyBuilder.parseSpec(id)


                state = over(itemLens, obj => merge(obj, merge(action.payload.patch, spec)))({biz: state}).biz
                /*if (scheme.name === 'JOB') {
                    spec = spec
                }*/
            }

            if (action.type.includes(POPULATED_POSTFIX))
                (action.payload.id as any as string[]).forEach(mutate)

            else
                mutate(action.payload.id)

            if (action.guid && action.masterEventId)
                state = {
                    ...state, meta: {
                        ...state.meta,
                        lastMasterEventGuid: action.guid,
                        lastMasterEventId: action.masterEventId,
                    }
                }

            return state
        }
    }


    return state
}


const createRig = {}
