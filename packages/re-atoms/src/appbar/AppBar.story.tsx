import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import AppBar from './AppBar'

declare const module
storiesOf('Appbar', module)
    .add('AppBar', () => (
        <AppBar
            appLabel='Управление пользователями'
            onMenuClick={action('menu clicked')}
            onSearchClick={action('search clicked')}
            onNotificationsCLick={action('notifications clicked')}
            onUserClick={action('user clicked')}
        />
    ))
