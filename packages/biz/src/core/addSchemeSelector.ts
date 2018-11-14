import {Dictionary, Fn1, keys, mergeAll, values} from 'ramda'
import {StateWithBiz} from '../BizState'
import {KeyBuilder} from './KeyBuilder'
import {Arrify, isArray} from '@local/utils'

type Selector<S, R> = (state?: S) => R
type BizSelector<R> = Selector<StateWithBiz, R>

type Builder<P, T> = Fn1<P, BizSelector<Dictionary<T>>>

type Formatter<P, T> = BizSelector<Dictionary<T>> & {
    asMap: BizSelector<Dictionary<T>>
    asList: BizSelector<T[]>
    asKeys: BizSelector<string[]>
}

export default <T, Spec>(keyBuilder: KeyBuilder<T, Spec>) => <P>(builder: Builder<P, T>) => (params: Arrify<P>): Formatter<P, T> => {


    const asMap = (state: StateWithBiz): Dictionary<T> => isArray(params)
        ? mergeAll(params.map(p => builder(p)(state)))
        : builder(params)(state)

    const asList = (state: StateWithBiz) => values(asMap(state))
    const asKeys = (state: StateWithBiz) => keys(asMap(state))

    return Object.assign(
        asMap,
        {
            asMap,
            asList,
            asKeys,
        }
    )
}
