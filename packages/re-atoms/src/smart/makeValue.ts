import {Action, messageFactory, Pure} from './Pure'

export type ValueState<T> = {
    value: T
}

export const getActions = <D>() => ({
    onChange: messageFactory<D>('onChange'),
})

export default <T = {}>(defaultValue: T = undefined) =>
    Pure<{ value: T }>()
        .addMsg(getActions<T>())
        //  .addEff(effects)
        .addReducer((state: ValueState<T>, action: Action<T>) => {
            if (action.type === 'onChange')
                return {
                    ...state,
                    value: action.payload,
                }
            if (state.value === undefined)
                return {
                    ...state,
                    value: defaultValue,
                }
            return state
        })
