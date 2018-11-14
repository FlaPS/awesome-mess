import * as React from 'react'
import {storiesOf} from '@storybook/react'
import StepLine, {StepInfo} from './StepLine'


const steps: StepInfo[] = [
    {
        label: 'Данные авторизации',
        description: 'Логин и Пароль',
    },
    {
        label: 'Персональные данные',
        description: 'Данные пользователя',
    },
    {
        label: 'Доступный функционал',
        description: 'Назначение ролей',
    },
    {
        label: 'Права доступа',
        description: 'Доступ к скважинам',
    },
]

declare const module
storiesOf('StepLine', module)
    .add('4 steps, schecked', () =>
        <StepLine currentStep={2} steps={steps}/>
    )
