import * as React from 'react'
import {addDecorator, storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {Wizard, WizardStep} from './Wizard'
import {UserVO} from '@local/biz'
import CreateLoginStep from '../chapters/access/createUser/CreateLoginStep'
import PersonalDataStep from '../chapters/access/createUser/CreatePersonalDataStep'


const steps: WizardStep<UserVO>[] = [
    {
        label: 'Данные авторизации',
        description: 'Логин и Пароль',
        component: CreateLoginStep,
    },
    {
        label: 'Персональные данные',
        description: 'Данные пользователя',
        component: PersonalDataStep,
    },
]

declare const module
storiesOf('Wizard', module)
    .add('Add createUser', () =>
        <Wizard steps={steps} onCancel={action('onCancel')} onComplete={action('onComplete')}/>
    )
