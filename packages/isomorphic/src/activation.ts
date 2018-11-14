import * as fsa from '@local/fsa'


const factory = fsa.actionCreatorFactory('actiovation')

export type ActivationRequest = {
    masterAddress: string,
    key: string
}


export type ActivationError = {
    status: 'error'
    error?: string
}

export type ActivationFailed = {
    status: 'fail'
    masterError?: string,
    keyError?: 'keyNotFound' | 'keyIsNotBinded' | 'keyBindedToUndefinedWell'
    error?: string
}

export type ActivationSuccess = {
    status: 'success'
    wellId: string
    permissions?: any
    key: string
    wellName: string
}

export type ActivationResponse = ActivationError | ActivationFailed | ActivationSuccess

export const actions = {
    factory,
    expired: factory<{ reason: string }>('expired'),
    requested: factory<ActivationRequest>('requested'),
    success: factory<ActivationSuccess>('success'),
    failed: factory<ActivationFailed | ActivationError>('failed'),
}

export const defaultActivationState = {} as any as ActivationState

export type ActivationState = {
    key?: string
    status?: string
    activationInRequest?: boolean
    masterAddress?: string
    masterError?: string
    keyError?: string
    wellId?: string
    permissions?: any
    expiredReason?: string
    error?: string
    wellName?: string
    activated?: boolean
}

export const reducer = (state: ActivationState = defaultActivationState, action: any): ActivationState => {
    if (actions.requested.isType(action)) {
        return {
            activationInRequest: true,
            ...action.payload,
            activated: false,
        }
    } else if (actions.success.isType(action)) {
        return {...action.payload, activated: true}
    } else if (actions.failed.isType(action)) {
        return {...action.payload, activated: true}
    } else if (actions.expired.isType(action)) {
        return {
            ...state,
            expiredReason: action.payload.reason,
            activated: false,
        }
    }
    return state
}
