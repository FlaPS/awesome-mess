import * as React from 'react'
import {storiesOf} from '@storybook/react'
import Switch from '../Switch'
import {InputProvider} from '../../InputProvider'
import makeValue from '../../smart/makeValue'


declare const module
storiesOf('Inputs/Switch', module)
    .add('Switch default', () =>
        <Switch/>
    )
    .add('Switch with label', () =>
        <Switch label='With label'/>
    )
    .add('Switch with disabled context', () =>
        <InputProvider disabled>
            <Switch label='With label and disabled'/>
        </InputProvider>
    )
    .add('Controled switch',
        makeValue(true)
            .ap(props => <Switch onChange={props.onChange} value={props.value}/>)
    )

