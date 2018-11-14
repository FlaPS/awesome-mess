import * as React from 'react'
import {connect} from 'react-redux'
import {applySpec} from 'ramda'

import {ObjectOmit} from 'typelevel-ts'

export default <T>(spec: T) =>
    <P>(Comp: React.ComponentType<P>): React.ComponentType<ObjectOmit<P, keyof T>> =>
        connect(applySpec<T>(spec))
        (Comp) as any as React.ComponentType<ObjectOmit<P, keyof T>>
