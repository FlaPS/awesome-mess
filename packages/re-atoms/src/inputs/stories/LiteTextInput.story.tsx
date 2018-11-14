import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import LiteTextInput from '../LiteTextInput'
import makeValue from '../../smart/makeValue'
import {bindInput} from '../../smart/form/bindInput'
import {formPure} from '../../smart/Form'
import {actions, PROJECT} from '@local/biz'
import {dispatch, getFrontendStore} from '../../store/'
import {InputProvider} from '../../InputProvider'


const ValuedTextField =
    makeValue<string>()
        .of(LiteTextInput)

const FromWithLiteInput = formPure(PROJECT)
    .ap(props => <LiteTextInput {...bindInput('name')(props)} />)

declare const module
storiesOf('Inputs/LiteTextInput', module)
    .add('Controlled input', () =>
        <ValuedTextField value='Some text'/>
    )
    .add('Disabled input', () =>
        <InputProvider readonly>
            <ValuedTextField value='Some text'/>
        </InputProvider>
    )
    .add('Well project scheme input', () =>
        <FromWithLiteInput
            model={getFrontendStore().getState().biz.projectId[0]}
            onValid={model => dispatch(actions.update(PROJECT, model))}
            limit={10}
        />
    )
    .add('Limited text input', () =>
        <ValuedTextField value={'some text'} maxLength={10}/>)
