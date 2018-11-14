import * as React from 'react'
import Library from '../../styles/SVGLibrary'
import Div from '../../layout/Div'
import {restyle} from '../../styles'
import Span from '../../layout/Span'
import {default as colors, GRAY, GREEN, LIGHT_GRAY, LIGHT_GREEN, TRANSPARENT, WHITE} from '../../styles/colors'
import {inc, times} from 'ramda'

type RoleSetupProps = {
    count: number
    value: number
    disabled?: number[]
    onChange: (value: number) => void
}

const CellContainer = restyle`
    display: inline-flex;
    flex-direction: row-reverse;
`(Div)

const Cell = restyle`
    display: flex;
    width: 144px;
    height: 64px;
    border: 0 solid ${colors.DARK_BORDER_GRAY};

    border-bottom-width: 1px;
    border-left-width: 1px;
    &:first-child {
        border-right-width: 1px;
    }

    transition: background-color .25s ease-in;

    > * {
        margin: auto;
        transition: background-color .25s ease-in;
    }
    svg {
        transition: all .25s ease-in;
    }
`(Div)

const Circle = restyle`
    border-radius: 50%;
    width: 32px;
    height: 32px;
    color: inherit;
    display: flex;
    > * {
        margin: auto;
    }
`(Span)

const ActiveCell = restyle`
    cursor: pointer;
    background-color: ${({checked}) => checked ? LIGHT_GRAY : TRANSPARENT};

    > * {
        background-color: ${({checked}) => checked ? LIGHT_GREEN : TRANSPARENT};
        opacity: ${({checked}) => checked ? 1 : 0}
    }
    svg {
        fill: ${({checked}) => checked ? GREEN : TRANSPARENT};
    }

    &:hover ~ *,
    &:hover {
        background-color: ${LIGHT_GREEN};

        > * {
            background-color: ${LIGHT_GREEN};
            opacity: 1;
        }
        svg {
            fill: ${GREEN};
        }
    }
`(Cell)

// !important is __important__ here because of '&:hover ~ *' selector
const DisabledCell = restyle`
    background-color: ${LIGHT_GRAY} !important;

    > * {
        background-color: ${GRAY} !important;
    }
    svg {
        fill: ${WHITE} !important;
    }
`(Cell)

type IconCheckType = {
    disabled: boolean
    checked: boolean
    onChange: () => void
}

const RenderingCell =
    ({onChange, disabled, checked}: IconCheckType) =>
        disabled
            ? (
                <DisabledCell>
                    <Circle>
                        <Library.CloseCross/>
                    </Circle>
                </DisabledCell>
            )
            : (
                <ActiveCell onClick={onChange} {...{checked}}>
                    <Circle>
                        <Library.RoleCheck/>
                    </Circle>
                </ActiveCell>
            )

const isDisabled =
    (disabledItems: number[]) =>
        (i: number) =>
            disabledItems && disabledItems.includes(i)

const renderActiveElement =
    ({value, onChange, disabled}: Partial<RoleSetupProps>, i: number) =>
        <RenderingCell
            key={i}
            checked={i <= value}
            disabled={isDisabled(disabled)(i)}
            onChange={() => onChange(i === value ? 0 : i)}
        />


const renderElement =
    (props: Partial<RoleSetupProps>) =>
        i => renderActiveElement(props, i)

const RoleSetup =
    ({count, ...rest}: RoleSetupProps) =>
        <CellContainer>
            {
                times(inc, count)
                // reverse and 'flex-direction: row-reverse' for css-based selection on hover by '&:hover ~ *'
                    .reverse()
                    .map(renderElement({...rest}))
            }
        </CellContainer>

export default RoleSetup
