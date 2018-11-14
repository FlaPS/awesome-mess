import * as biz from '@local/biz'
import * as React from 'react'
import {connect} from 'react-redux'

type InputProps = {
    value: string
    onChange: (value: string) => any
}

export default <T, P>(scheme: biz.Scheme<T>, property: keyof T, Comp: React.ComponentType<P>,)
    : React.ComponentType<P & { idOrSpec: string }> =>
    connect(
        (state: biz.StateWithBiz, props: { idOrSpec: string }) => ({
            value: biz.sel(scheme).bySpec(props.idOrSpec)(state)[property],
        }),
        (dispatch, props: { idOrSpec: string }) => ({
            onChange: value =>
                // @ts-ignore
                dispatch(biz.actions.update(scheme, props.idOrSpec, {[property]: value})),
        })
        // @ts-ignore
    )(Comp) as any as React.ComponentType<P & { idOrSpec: string }>

