import pureTree from '../pureTree'
import {Column, makeGrid} from './Grid'
import {Scheme} from '@local/biz'
import cols from './columns'

export default <T, P = {}>(scheme: Scheme<T>, columns: Array<keyof T | Column<T, P>>) =>
    pureTree<T, P>(scheme)
        .of(makeGrid<T, P>(cols(scheme).create(columns)))
