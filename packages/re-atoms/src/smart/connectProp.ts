import * as TL from 'typelevel-ts'
import * as React from 'react'
import {connect} from 'react-redux'
import {StateWithBiz} from '@local/biz'

type StateGetter<O> = (state: StateWithBiz) => O

type Selector<P, I = P, O = any> = (props: Partial<P> & I) => StateGetter<O>

export default <P, I, K extends keyof P>(Comp: React.ComponentType<P>, key: K, selector: Selector<P, I, P[K]>) =>
    connect((state: StateWithBiz, props: P & I) =>
        ({
            [key]: selector(props)(state),
        })
    )(Comp as any) as any as React.ComponentType<TL.ObjectOmit<P, K> & I>

export const connectProps = <I, O>(selector: Selector<I, I, O>) =>
    <P extends O>(Comp: React.ComponentType<P>) =>
        connect((state: StateWithBiz, props: I) =>
            selector(props)(state)
        )(Comp as any) as any as React.ComponentType<TL.ObjectOmit<P, keyof O> & I>
