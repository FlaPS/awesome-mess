import * as React from 'react'
import {Scheme} from '@local/biz'
import * as TL from 'typelevel-ts'
import {connect} from 'react-redux'
import {dispatch} from '../store/'

export default <T, Spec>(scheme: Scheme<T, Spec>) =>
    <P extends { model: T & Spec, forked: boolean, onValid: (value: T & Spec) => any, onInvalid: (value: T & Spec) => any }>(Component: React.ComponentType<P>)
        : React.ComponentType<TL.ObjectOmit<P, keyof { onValid, onInvalid, model, forked }> & Spec> =>
        connect((state, props) =>
            ({
                model: scheme.bySpec(props as any as Spec)(state) || {}
            }),
        )(props =>
            React.createElement(Component, {
                ...props,
                forked: false,
                onValid: (obj: T & Spec) => {
                    dispatch(scheme.update(props as Spec, obj))
                },
                onInvalid: (obj: T & Spec) => {
                    dispatch(scheme.update(props as Spec, obj))
                },
            })) as any as React.ComponentType<TL.ObjectOmit<P, keyof { onValid, onInvalid, model, forked }> & Spec>
            