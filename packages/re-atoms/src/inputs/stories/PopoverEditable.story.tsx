import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import PopoverEditable from '../PopoverEditable'

declare const module
storiesOf('Inputs/PopoverEditable', module)
    .add('Popover Editable', () => (
        <div style={{width: '240px'}}>
            <PopoverEditable
                value='Какой-то ооооооооооооооооооооооочень длинный текст'
                onValueSave={action('onValueSave')}
            />
        </div>
    ))
