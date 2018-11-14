import {isArray} from '@local/utils'


export type BizPayload<T> = BizSingularPayload<T> | BizPluralPayload<T>


export type BizSingularPayload<T> = {
    id: string
    patch: T
    wellId?: string
    userId?: string
}

export const isSingularPayload = <T>(payload: BizPayload<T>): payload is BizSingularPayload<T> =>
    isArray(payload.id)

export type BizPluralPayload<T> = {
    id: string []
    patch: T
    wellId?: string
    userId?: string
}

export type BizAction<T> = {
    type: string
    payload: BizPayload<T>
    guid?: string

    masterEventId?: string
    slaveEventId?: number
    slaveId?: number
    time?: number
    meta?: {
        destination?: string
        notification?: string
    }
}

export type BizSingularAction<T> = BizAction<T> & {

    payload: BizSingularPayload<T>

}