import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {FormSection} from './FormSection'
import Library from '../styles/SVGLibrary'
import TextInput from '../inputs/TextInput'
import {InputProvider} from '../InputProvider'

declare const module
storiesOf('layout/FormSection', module)
    .add('Default full width', () =>
        <InputProvider readonly>
            <FormSection label='Персональные данные' icon={Library.PersonCopy} done={false}>
                <TextInput label='Фамилия' value='Васькин'/>
                <TextInput label='Имя' value='Василий'/>
                <TextInput label='Отчество' value='Васильевич'/>
            </FormSection>
        </InputProvider>
    )
