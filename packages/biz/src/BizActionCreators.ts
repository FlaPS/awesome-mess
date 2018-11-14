import {Scheme, UNKNOWN} from './core/Scheme'
import * as fsa from '@local/fsa'
import {getNextId, sel} from './sel'
import {getStore} from '@local/root'
import {BizState} from './BizState'
import {capitalize, isFrontend} from '@local/utils'
import {schemes} from './schemes'
import {VO} from './core/VO'
import {BizAction, BizSingularAction} from './actions/BizAction'
import {
    BIZ_PREFIX,
    CREATED_POSTFIX,
    DELETED_POSTFIX,
    POPULATED_POSTFIX,
    REMOVED_POSTFIX,
    SEED_POSTFIX,
    UPDATED_POSTFIX
} from './actions/constants'
import {KeyOrSpec} from './index'

export {
    BIZ_PREFIX,
    SEED_POSTFIX,
    CREATED_POSTFIX,
    UPDATED_POSTFIX,
    DELETED_POSTFIX,
    REMOVED_POSTFIX,
    POPULATED_POSTFIX,
}

export const bizFactory = fsa.actionCreatorFactory(BIZ_PREFIX)
export const resetFactory = fsa.actionCreatorFactory('reset')

const getMeta = () => isFrontend() ? {destination: 'io'} : {}

export const actions = {
    create: <T, Spec>(
        scheme: Scheme<T, Spec>,
        patch: Partial<T>,
        itemId?: KeyOrSpec<Spec>
    ): BizSingularAction<Partial<T>> => {
        const id = itemId ? itemId : getNextId(scheme)(getStore<{ biz: BizState }>().getState())
        const key = scheme.keyBuilder.buildKey(id)
        return {
            type: BIZ_PREFIX + scheme.actionPrefix + CREATED_POSTFIX,
            payload:
                {
                    id: key,
                    patch: Object.assign(
                        {[scheme.uniqueProperty]: id},
                        patch
                    ),
                },
            meta: getMeta(),
        }
    },

    update: <T>(scheme: Scheme<T>,
                idOrPatch: string | Partial<T>,
                patch: Partial<T> = undefined, wellId: string = undefined): BizAction<Partial<T>> => {
        let id
        if (typeof idOrPatch === 'string')
            id = idOrPatch
        else {
            patch = idOrPatch
            id = patch[scheme.uniqueProperty]
        }
        return {
            type: BIZ_PREFIX + scheme.actionPrefix + UPDATED_POSTFIX,
            payload:
                {
                    id,
                    wellId,
                    patch,
                },
            meta: getMeta(),
        }
    },
    populate: <T>(scheme: Scheme<T>,
                  patch: Partial<T> = undefined,
                  ids: string[],
                  wellId: string = undefined): BizAction<Partial<T>> => {

        return {
            type: BIZ_PREFIX + scheme.actionPrefix + POPULATED_POSTFIX,
            payload:
                {
                    id: ids,
                    wellId,
                    patch,
                },
            meta: getMeta(),
        }
    },
    remove: <T extends VO>(scheme: Scheme<T>,
                           id: string,
                           patch = {removed: true} as any as Partial<T>,
                           wellId: string = undefined): BizAction<Partial<T>> =>
        (
            {
                type: BIZ_PREFIX + scheme.actionPrefix + REMOVED_POSTFIX,
                payload:
                    {
                        id,
                        wellId,
                        patch,
                    },
                meta: getMeta(),
            }
        ),

    factory: bizFactory,
    reset: resetFactory<{ biz: BizState }>('biz'),
    clearState: resetFactory('clear'),
    setStateGUID: resetFactory<string>('setStateGUID'),
}

export const getSchemeByAction = <T>(action: BizAction<T>): Scheme<T> => {
    if (!action.type)
        return UNKNOWN as any as Scheme<T>

    const actionPrefix = action.type.split('/')[1]

    return schemes[actionPrefix]
}


const parseActionToShortMessage = (action: BizAction<any>): string => {
    const scheme = getSchemeByAction(action)
    const selectors = sel(scheme)
    const postfix = action.type.split('/')[2]

    let message = 'обновлена'

    if (CREATED_POSTFIX.includes(postfix)) {
        if (scheme.lang.gender === 'm')
            message = 'создан'
        if (scheme.lang.gender === 'f')
            message = 'создана'
        if (scheme.lang.gender === 'n')
            message = 'создано'
    } else if (UPDATED_POSTFIX.includes(postfix)) {
        if (scheme.lang.gender === 'm')
            message = 'обновлён'
        if (scheme.lang.gender === 'f')
            message = 'обновлена'
        if (scheme.lang.gender === 'n')
            message = 'обновлено'
    } else {
        if (scheme.lang.gender === 'm')
            message = 'удалён'
        if (scheme.lang.gender === 'f')
            message = 'удалена'
        if (scheme.lang.gender === 'n')
            message = 'удалено'
    }


    return capitalize(scheme.lang.singular) + ' ' +
        selectors.getShortName(selectors.byKey(action.payload.id as any as string)()) + ' ' +
        message

}


export const getShortMessage = (action: BizAction<any>): string =>
    (action.meta && action.meta.notification) || parseActionToShortMessage(action)

export const isBizAction = (action): action is BizAction<any> =>
    action.type && action.type.startsWith(BIZ_PREFIX)
