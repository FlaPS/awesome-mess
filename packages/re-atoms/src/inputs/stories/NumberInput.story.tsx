import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {NumberInput} from '../NumberInput'

declare const module
storiesOf('Inputs/NumberInput', module)
    .add('Regular input', () => (
        <NumberInput value={0} onChange={action('onChange')}/>
    ))
    .add('Min/max input', () => (
        <NumberInput minValue={-10} maxValue={20} value={0} onChange={action('onChange')}/>
    ))
    .add('disabled input', () => (
        <NumberInput disabled value={220} onChange={action('onChange')}/>
    ))
