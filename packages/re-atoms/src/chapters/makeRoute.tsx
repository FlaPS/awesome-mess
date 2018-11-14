import {dispatch} from '../store/'
import {RouteConfig, RouteIndex} from '../app/navHelpers'
import * as React from 'react'
import {push} from 'react-router-redux'
import {Route} from 'react-router'

const routes: Map<any, any> = new Map()

export default function makeRoute<P>(
    route: RouteIndex<P>,
    Comp: React.ComponentType<P>,
    parentRoute?: RouteConfig): RouteIndex<P> & { push: (cfg: P) => any, replace: (cfg: P) => any } {
    route.component = Comp

    if (parentRoute)
        parentRoute[route.path] = route
    if (!route.get)
        route.get = () => route.path

    const routeWithActions = Object.assign(
        route,
        {
            push: (props: P) => dispatch(
                push(route.get(props))
            ),
            replace: (props: P) => dispatch(
                push(route.get(props))
            ),
        }
    )
    const Routed = (extraProps?) =>
        <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props => {

                return <Comp {...props.match.params} {...props} {...extraProps}/>
            }}
        />


    const result = Object.assign(routeWithActions, {Routed})

    return result
}

