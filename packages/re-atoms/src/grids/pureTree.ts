import {Action, Empty, messageFactory} from '../smart/Pure'
import makeValue from '../smart/makeValue'
import {map} from 'ramda'


import {ExpandableProps, TreeMode} from './Expandable'
import {GridProps, GridState} from './grid/Grid'
import {toIndexedArray} from '@local/utils'

import {Scheme} from '@local/biz'


type WithToolbarState<T> = {
    mode: T
}

const getActions = () => ({
    onModeChange: messageFactory<TreeMode>('onModeChange'),

})

type ToolbarProps = {
    onSelectionSubmit?: (value: string[]) => any
    onSelectionCancel?: () => any
    onRequestAdd?: () => any
}

export default </*item of scheme, or any data object */
    T = Empty,
    /*Additional properties required by tree*/
    P = Empty>(scheme?: Scheme<T>) =>
    makeValue<string[]>([])
        .addProps({scheme})

        .addProps<ExpandableProps<T, GridProps<T, P>, GridState<T>> & P>()
        .addProps({title: 'Таблица'})
        .addState<{ search: string }>()
        .addMsg(getActions())
        .addReducer((state: { mode: TreeMode, value: string[] }, action: Action<TreeMode>) =>
            action.type === 'onModeChange'
                ? {...state, value: [], mode: action.payload}
                : (
                    state.mode
                        ? state
                        : {...state, mode: TreeMode.VIEW}
                )
        )
        .recieveProps((state, props, next) => {
                if (next.idKey && props.data !== next.data) {
                    const array = Array.isArray(next.data) ? next.data : toIndexedArray(next.data)

                    const availableIds: string[] = map(d => d[props.idKey] as any as string, array)

                    const availableValue = state.value.filter(v => availableIds.includes(v))

                    return {...state, value: availableValue, data: next.data}
                }
                if (props.data !== next.data)
                    return {...state, data: next.data}
                return state
            }
        )

