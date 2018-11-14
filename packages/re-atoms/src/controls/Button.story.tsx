import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import Button from '../controls/Button'
import Fab from '../controls/Fab'
import Library from '../styles/SVGLibrary'
import ExpansionButton from './ExpansionButton'
import RemoveButton from './RemoveButton'

declare const module
storiesOf('Controls/Button', module)
    .add('Primary raised button', () => (
        <Button primary onClick={action('clicked')}>Подтвердить!</Button>
    ))
    .add('Accent button with icon, not raised', () => (
        <Button color='primary' onClick={action('clicked')}>
            <Library.AddUserGroup style={{marginRight: '16px'}}/>
            Добавить группу
        </Button>
    ))
    .add('Primary disabled button', () => (
        <Button primary disabled onClick={action('clicked')}>Подтвердить</Button>
    ))
    .add('Default button ', () => (
        <Button onClick={action('clicked')}>Отмена</Button>
    ))
    .add('Default disabled button', () => (
        <Button disabled onClick={action('clicked')}>Отмена!</Button>
    ))
    .add('Float action with default icon', () => (
        <Fab onClick={action('clicked')}/>
    ))
    .add('Float action button', () => (
        <Fab onClick={action('clicked')}>
            <Library.PersonCopy/>
        </Fab>
    ))
    .add('Expansion button', () => (
        <div style={{width: '100px', height: '100px'}}>
            <ExpansionButton value={false} onChange={action('clicked')}/>
        </div>
    ))
    .add('Remove button', () => <RemoveButton onClick={action('clicked')}/>)
    .add('disabled Remove button', () => <RemoveButton disabled/>)

