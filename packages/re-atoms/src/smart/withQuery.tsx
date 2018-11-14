import getFrontendStore from '../store/'
import * as React from 'react'
import {replace} from 'react-router-redux'


const getSearch = key => {
    let result = {}
    if (window.location.search.length > 1) {
        try {
            result = JSON.parse(decodeURI(window.location.search).substr(1))[key] || {}
        } catch (e) {
            result = {}
        }
    }
    return result
}

const setSearch = (key, value) => {

    let result = {}
    try {
        result = JSON.parse(window.location.search) || {}

    } catch (e) {
        result = {}
    }

    const prev = result[key] || {}
    result[key] = {...prev, ...value}

    const action = replace({
        pathname: window.location.pathname,
        search: JSON.stringify(result),
    })

    getFrontendStore().dispatch(action)

}

const getQuery = key => getSearch(key)

const setQuery = (key, value) =>
    setSearch(key, value)

type QueryKeyGetter<Props> = string | ((props: Props) => string)

type PropsWithQuery<Props, Query> = Props & Partial<Query> &
    {
        defaultQuery?: Partial<Query>
        queryKey?: string | QueryKeyGetter<Props>
        onQueryChange?: (Query: Partial<Query>) => any
    }

export default function <S>(defaultQuery: S) {
    return function <P>(
        Comp: React.ComponentType<P>,
        gueryKey: QueryKeyGetter<any> | string
    ): React.ComponentType<PropsWithQuery<P, S>> {


        return function (props: PropsWithQuery<P, S>) {
            const key = typeof gueryKey === 'function' ? gueryKey(props) : gueryKey
            const savedQuery = getQuery(key)

            console.log('render with query', savedQuery)

            function onQueryChange(Query: Partial<S>) {
                const key = typeof gueryKey === 'function' ? gueryKey(props) : gueryKey
                setQuery(key, Query)
            }

            return <Comp {...props} {...savedQuery} onQueryChange={onQueryChange}/>
        } as any as React.ComponentType<PropsWithQuery<P, S>>
    }
}
