import * as React from 'react'
import {Action, messageFactory, Pure} from './Pure'

const msgs = {
    onToggle: messageFactory('onToggle'),
}

const effects = {
    onToggleOn: messageFactory('onToggleOn'),
    onToggleOff: messageFactory('onToggleOff'),
}

const SimpleToggle = Pure()
    .addMsg(msgs)
    .addReducer<{ on: boolean }>((state, action: Action<any>) => {
        if (action.type === 'onToggle')
            return {
                ...state,
                on: (action.payload !== true || action.payload !== false)
                    ? !state.on
                    : action.payload,
            }

        return state
    })


const Counter = Pure()
    .addReducer(({counter = 1, ...state}: { counter: number }, action) =>
        ({...state, counter: Number(counter) + 1})
    )

const Toggle = Pure<{ on: boolean }>()
    .concat(SimpleToggle)
    .addEff(effects)
    /*.ap( (props, context) => {
            console.log('ap childern', props.children)
            return  <div style={{width: '800px'}}>{props.children(props, context)}</div>
        }
    )*/
    .addResolver((effects, state, nextState) => {
        if (state.on !== nextState.on) {
            if (nextState.on)
                return effects.onToggleOn()
            else
                return effects.onToggleOff()
        }
    })
    .concat(Counter)


export default Toggle
