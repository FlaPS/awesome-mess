import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import CreateLoginStep from './CreateLoginStep'
import PersonalDataStep from './CreatePersonalDataStep'

declare const module
storiesOf('CreateUser', module)
    .add('create new login', () =>
        <CreateLoginStep
            model={{login: 'Вася', password: 'Пупкин'}}
            onValid={action('Valid')}
            onInvalid={action('InValid')}
        />
    )
    .add('create personal data', () =>
        <PersonalDataStep
            model={{login: 'Вася', password: 'Пупкин'}}
            onValid={action('Valid')}
            onInvalid={action('InValid')}
        />
    )
