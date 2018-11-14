import * as React from 'react'
import {restyle} from '../styles/restyle'
import {Div} from '../layout'
import {compose, identity} from 'ramda'
import {colors} from '../styles'

export const InputReadOnlyContainer = restyle`
    color: ${colors.EXTRA_SOFT_BLACK};
    font-family: Roboto;
    font-size: 12px;
    margin-bottom: 12px;
`(Div)

const InputReadOnlyMainText = restyle`
    margin-top: 4px;
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 16px;
    line-height: 1.5em;
    min-height: 1.5em;
`(Div)

export const InputReadOnlyEmpty = restyle`
    color: ${colors.EXTRA_SOFT_BLACK};
    font-size: 16px;
    line-height: 1.5em;
`(Div)

export type TextFieldReadonly = {
    value?: string
    formatter?: (value: string) => React.ReactNode
    label: string
}

const renderValue = (formatter: (value: string) => React.ReactNode) => compose(
    x => x ? x : <InputReadOnlyEmpty>{'—'}</InputReadOnlyEmpty>,
    formatter
)

const InputReadOnly: React.SFC<TextFieldReadonly> = ({formatter, value, label, ...props}) =>
    <InputReadOnlyContainer>
        {label}
        <InputReadOnlyMainText>
            {renderValue(formatter)(value)}
        </InputReadOnlyMainText>
    </InputReadOnlyContainer>

InputReadOnly.defaultProps = {
    formatter: identity,
}

export default InputReadOnly
