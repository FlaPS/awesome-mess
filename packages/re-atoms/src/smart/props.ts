import {Store} from 'redux'
import * as React from 'react'
import {connect} from 'react-redux'
import * as TL from 'typelevel-ts'
import {StateWithBiz} from '@local/biz'
import * as Recompose from 'recompose'


const safetyRunSelector = (selector: Function, props, state) => {
    try {
        return selector(props)(state)
    } catch (e) {
        console.info('Selector error', e, selector.name, props, state)
    }
    return undefined
}

/**
 *
 * Utils to propam props
 */
const factory = <State>(store?: Store<State>) => {
    type StateGetter<O> = (state: State) => O
    type Selector<P, I = any, O = any> = (props: P & I) => StateGetter<O>

    type PropsMapper<P, I, O extends Partial<P> = P> = (props: I) => O | O

    type Mapper<P> = {
        key: keyof P
        selector: Selector<P>
    }


    const props = <P, OriginalProps = P>(
        Comp: React.ComponentType<P>,
        stateMappers: Mapper<OriginalProps>[] = [],
        withPropsMappers: PropsMapper<P, OriginalProps>[] = []
    ) => {
        const reduceMappers = (state: State, props?: P) =>
            stateMappers.reduce(
                (out, mapper) =>
                    Object.assign(
                        {},
                        out,
                        {
                            [mapper.key]: safetyRunSelector(mapper.selector, out, state),
                        }
                    ),
                props
            )

        const Result = reduceMappers.length
            ? connect(reduceMappers)(Comp)
            : Comp

        /**
         * Connect single prop of component to the store
         */
        const connectProp = <I, K extends keyof OriginalProps = any>(
            key: K,
            selector: Selector<OriginalProps, I, OriginalProps[K]>
        ) =>
            props<TL.ObjectOmit<P, K> & I, OriginalProps>(
                Comp as any as React.ComponentType<TL.ObjectOmit<P, K> & I>,
                [...stateMappers, {key, selector}],
                withPropsMappers as any as Array<PropsMapper<TL.ObjectOmit<P, K> & I, OriginalProps>>
            )

        const withProps = <I extends Partial<P>>(defaults: I) =>
            props<TL.ObjectOmit<P, keyof I>, OriginalProps>(
                Recompose.withProps(defaults)(Comp as any) as any as React.ComponentType<TL.ObjectOmit<P, keyof I>>,
                stateMappers
            )
        const withProp = <I, K extends keyof P>(key: K, value: P[K]) =>
            props<TL.ObjectOmit<P, keyof I>, OriginalProps>(
                Recompose.withProps({[key]: value})(Comp as any) as any as React.ComponentType<TL.ObjectOmit<P, keyof I>>,
                stateMappers
            )

        const defaultProp = <I, K extends keyof P>(key: K, value: P[K]) =>
            props<TL.ObjectOptional<P, K>, OriginalProps>(
                Recompose.defaultProps({[key]: value})(Comp as any) as any as React.ComponentType<TL.ObjectOptional<P, K>>,
                stateMappers
            )

        return Object.assign(
            Result as any as React.ComponentType<P>,
            {
                connectProp,
                withProps,
                withProp,
                defaultProp,
            }
        )

    }

    return props
}

export default factory<StateWithBiz>()

