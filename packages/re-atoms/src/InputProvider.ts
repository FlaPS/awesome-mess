import * as React from 'react'
import {withContext} from 'recompose'
import * as ReactPropTypes from 'prop-types'

export type InputProviderProps = {
    disabled?: boolean
    readonly?: boolean
    children?: React.ReactNode
}


export const InputProvider =
    withContext<InputProviderProps, InputProviderProps>(
        {
            disabled: ReactPropTypes.bool,
            readonly: ReactPropTypes.bool,
        },
        ({disabled, readonly}: InputProviderProps) => ({disabled, readonly})
    )(({children}) => children as any as React.ReactElement<any>) as React.ComponentType<InputProviderProps>

