import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {default as SidebarMenu} from './SidebarMenu'
import {Library} from '../styles/SVGLibrary'
import {RouteIndex} from '../app/navHelpers'
import withErrorHandler from '../misc/ErrorHandlerHOC'

const items: Array<RouteIndex> = [
    {icon: <Library.User/>, label: 'Пользователи', route: 'users', path: '12'},
    {icon: <Library.Well/>, label: 'Скважины', route: 'wells', path: '23'},
]
const Error = props => <div>error</div>
const SidebarHandled = withErrorHandler(action('error'), Error, SidebarMenu)

declare const module
storiesOf('SidebarMenu', module)
    .add('SideBarmenu', () =>
        <SidebarHandled items={items} value={items[1]}/>
    )
