import * as React from 'react'
import {ConnectedRouter} from 'react-router-redux'
import {browserHistory, FrontState} from '../store/'
import {renderRoutes, RouteConfig} from './navHelpers'
import nav from './nav'
import {connect} from 'react-redux'

export default connect(
    (state: FrontState) => ({busy: state.ui.busy})
)
(props => {
        return props.busy
            ? null
            : <ConnectedRouter history={browserHistory}>
                {renderRoutes(nav as any as RouteConfig)}
            </ConnectedRouter>
    }
)
