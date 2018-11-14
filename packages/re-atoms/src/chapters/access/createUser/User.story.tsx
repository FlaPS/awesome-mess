import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import UserCreated from './UserCreated'
import PersonDataSection from '../user/PersonDataSection'
import {InputProvider} from '../../../InputProvider'

declare const module
storiesOf('User', module)
    .add('createUser created form', () => (
        <UserCreated
            login='P.Petrov'
            password='password'
            onDoneClick={action('onDoneClick click')}
            onPrintClick={action('onPrintClick click')}
            onSendClick={action('onSendClick click')}
        />)
    )
    .add('person data section', () => (
        <InputProvider readonly>
            <PersonDataSection
                userId='2'
            />
        </InputProvider>
    ))
