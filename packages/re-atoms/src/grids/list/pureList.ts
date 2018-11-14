import pureTree from '../pureTree'
import {Scheme} from '@local/biz'
import {makeList} from './List'

export default <T, P = {}>(scheme: Scheme<T>) =>
    pureTree<T, P>(scheme)
        .of(makeList<T, P>(scheme))
