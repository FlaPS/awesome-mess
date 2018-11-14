import ConfirmDialog from '../misc/ConfirmDialog'
import * as React from 'react'
import Toggle from '../smart/Toggle'
import AppBar from '../appbar/AppBar'
import SidebarMenu from '../sidebarMenu/SidebarMenu'
import Drawer from 'material-ui/Drawer'
import {dispatch} from '../store/'
import {push} from 'react-router-redux'
import {matchPath} from 'react-router'
import {getRouteTitle, renderRoutes, RouteConfigComponentProps} from './navHelpers'
import {toIndexedArray} from '@local/utils'
import Snackbar from '../misc/Snackbar'
import {getMatchedRoute} from './nav'


import {omit} from 'ramda'

export class AppFrame extends React.Component<RouteConfigComponentProps<void>, any> {
    render() {
        const currentRoute = this.props.location.pathname || ''
        const sidebarItems = toIndexedArray(omit(['index'], this.props.route))

        const {path} = getMatchedRoute(this.props.location.pathname)
        const {params} = matchPath(this.props.location.pathname, {path})

        const title = getRouteTitle(getMatchedRoute(this.props.location.pathname), params)

        return (
            <Toggle on={false}>
                {
                    props =>
                        <div>
                            <div onClick={() => props.on && props.onToggle(false)}>
                                <AppBar
                                    appLabel={title}
                                    onMenuClick={e => {
                                        e.preventDefault()
                                        props.onToggle(true)
                                    }
                                    }
                                    onSearchClick={e => alert('search clicked')}
                                    onNotificationsCLick={() => alert('notifications clicked')}
                                    onUserClick={() => alert('user clicked')}
                                />
                            </div>
                            <div style={{marginTop: '54px'}}>
                                {renderRoutes(this.props.route)}
                            </div>
                            <Drawer type='temporary' open={props.on} onRequestClose={() => props.onToggle(false)}>
                                <SidebarMenu
                                    items={sidebarItems}
                                    value={sidebarItems.find(i => currentRoute.includes(i['index'].path))}
                                    onChange={route => {
                                        props.onToggle(false)
                                        dispatch(push(route.innerIndex || route.path))
                                    }}
                                />
                            </Drawer>
                            <Snackbar/>
                            <ConfirmDialog/>
                        </div>
                }
            </Toggle>
        )
    }
}
