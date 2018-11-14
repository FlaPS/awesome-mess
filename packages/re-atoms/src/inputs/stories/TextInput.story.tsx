import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import TextInput from '../TextInput'
import makeValue from '../../smart/makeValue'

const DateInput = makeValue<string>('2016-10-10').of(props =>
    <TextInput
        required
        label='Some label'
        type='date'
        value={props.value}
        onChange={value => props.onChange(value)}
    />
)

const ControlledTextInput = makeValue<string>('default assigment').of(props =>
    <TextInput
        required
        label='Some label'
        value={props.value}
        onChange={value => props.onChange(value)}
    />
)

declare const module
storiesOf('Inputs/TextInput', module)
    .add('controlled input with value', () =>
        <ControlledTextInput/>
    )
    .add('Regular input', () => (
        <TextInput
            inputProps={{maxLength: 2}}
            label='Имя и фамилия'
            onClick={action('clicked')}
            onChange={console.log}
        >
            Подтвердить
        </TextInput>
    ))
    .add('Required input', () => (
        <TextInput required label='Имя и фамилия' maxLength={10} defaultValue='Васяныя!'/>
    ))
    .add('Date input', () => <DateInput/>)
    .add('Readonly input', () =>
        <TextInput readonly label='Имя и фамилия' defaultValue='Васяныя!'/>
    )
    .add('InputProvider input', () => (
        <TextInput label='Заблокировано' disabled onClick={action('clicked')}>Подтвердить</TextInput>
    ))
    .add('Error input', () => (
        <TextInput
            error
            helperText='Какая-то ошибка'
            label='Телефон'
            onClick={action('clicked')}
        >
            Подтвердить
        </TextInput>
    ))
