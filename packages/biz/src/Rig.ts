import {AssociativeArray} from '@local/utils'
import {JobVO} from './rig/Job'
import {BizAction} from './actions/BizAction'
import {CREATED_POSTFIX, getSchemeByAction} from './BizActionCreators'

export const defaultRig = {
    wellId: '',
    jobId: {} as any as AssociativeArray<JobVO>,
}


export type RigVO = typeof defaultRig

export type RigsState = AssociativeArray<RigVO>

const createNewRig = (wellId: string): RigVO => ({
    ...defaultRig,
    wellId,
})

export const reducer = <T>(state: RigsState, action: BizAction<T>): RigsState => {
    const scheme = getSchemeByAction(action)

    return scheme &&
    scheme.name === 'WELL' &&
    action.type.endsWith(CREATED_POSTFIX)
        ? {
            ...state,
            [action.payload.id as any as string]: createNewRig(action.payload.id as any as string),
        }

        : state
}
