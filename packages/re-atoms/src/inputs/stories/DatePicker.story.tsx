import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import DateInput from '../DateInput'
import {InputProvider} from '../../InputProvider'


declare const module
storiesOf('Inputs/Date', module)
    .add('Regular input', () => (
        <DateInput inputProps={{maxLength: 2}} label='Имя и фамилия' onClick={action('clicked')}>Подтвердить</DateInput>
    ))
    .add('Required input', () => (
        <DateInput required label='Имя и фамилия' maxLength={10} defaultValue='Васяныя!'/>
    ))
    .add('Date input', () => <DateInput/>)
    .add('Readonly input', () =>
        <DateInput readonly label='Имя и фамилия' defaultValue='Васяныя!'/>
    )
    .add('Readonly context input', () =>
        <InputProvider readonly>
            <DateInput label='Дата создания'/>
        </InputProvider>
    )
    .add('Disabled context input', () =>
        <InputProvider disabled>
            <DateInput label='Дата создания'/>
        </InputProvider>
    )
    .add('InputProvider input', () => (
        <DateInput label='Заблокировано' disabled onClick={action('clicked')}>Подтвердить</DateInput>
    ))
    .add('Error input', () => (
        <DateInput
            error
            helperText='Какая-то ошибка'
            label='Телефон'
            onClick={action('clicked')}
        >
            Подтвердить
        </DateInput>
    ))
