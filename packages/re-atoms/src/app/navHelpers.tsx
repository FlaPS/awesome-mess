import * as React from 'react'
import Switch from 'react-router/Switch'
import Route from 'react-router/Route'
import {map, omit, values} from 'ramda'
import {match, RouteComponentProps} from 'react-router'
import {Location} from 'history'
import {toIndexedArray} from '@local/utils'
import matchPath from 'react-router/matchPath'
import Router from 'react-router/Router'

export interface RouteConfigComponentProps<T> extends RouteComponentProps<T> {
    route?: RouteConfig
}

export const getRouteTitle = function <T>(routeIndex: RouteIndex<T>, params: T): string {
    return typeof routeIndex.title === 'string'
        ? routeIndex.title
        : (
            routeIndex.title
                ? routeIndex.title(params)
                : routeIndex.path
        )
}

export type RouteIndex<T = void> = {
    get?: (cfg: T) => string
    props?: T
    innerIndex?: string
    location?: Location
    component?: React.ComponentType<RouteConfigComponentProps<any> | {}>
    path?: string
    exact?: boolean
    strict?: boolean
    icon?: any
    label?: string
    title?: string | ((params: T) => string)
}


type Only<T extends M, M> = T
type Rest<T extends M, M> = M

export type RouteConfig<T = {}> = {
    [key: string]: RouteConfig | RouteIndex<T>
    index: RouteIndex<T>
}

export type RouteMap = {
    [key: string]: RouteConfig
}


export interface MatchedRoute<T> {
    route: RouteConfig
    match: match<T>
}

const {computeMatch} = Router.prototype

export const findRouteMatch = route => pathname => {
    const {index, ...other} = route
    const subRoutes = values(other)
    const subMatches = subRoutes.map(r => findRouteMatch(r)(pathname)).filter(m => m != null)
    const selfMatch = matchPath(pathname, index)
    const result = subMatches[0] || selfMatch
    return result
}


export const renderRoutes = (routeConfig: RouteConfig, extraProps = {}) => {

    return routeConfig ? (
        <Switch>
            {map((r: any) =>
                    <Route
                        key={r.index.path}
                        path={r.index.path}
                        exact={r.index.exact}
                        strict={r.index.strict}
                        render={props => (
                            <r.index.component {...props} {...props.match.params} {...extraProps} route={r}/>
                        )}
                    />
                , toIndexedArray(omit(['index'], routeConfig)))}
        </Switch>
    ) : null
}


