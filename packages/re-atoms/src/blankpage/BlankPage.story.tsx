import * as React from 'react'
import Library from '../styles/SVGLibrary'
import {action, storiesOf} from '@storybook/react'
import BlankPage from './BlankPage'

declare const module
storiesOf('Blank page', module)
    .add('page', () => (
        <BlankPage
            label='Нет созданных групп скважин'
            subLabel='Создать новую группу скважин'
            onAddClick={action('add click')}
            icon={<Library.WellGroup viewBox='0 0 96 96' style={{width: '96px', height: '96px'}}/>}
        />
    ))
