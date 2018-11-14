import * as React from 'react'
import {Stateful} from './Stateful'
import {renderRoutes, RouteConfigComponentProps} from '../app/navHelpers'


const getRouteParams = <T>(props: RouteConfigComponentProps<T>) =>
    props.match.params


/**
 * Class for route page
 */
export default class RoutedPage<RouteParams, S = any> extends Stateful<RouteConfigComponentProps<RouteParams>, S> {

    protected getParams = (): RouteParams =>
        getRouteParams(this.props)


    protected renderChildRoutes = (): React.ReactElement<any> =>
        renderRoutes(this.props.route)

}
