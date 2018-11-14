import * as React from 'react'
import styled from 'styled-components'
import {ButtonProps} from './Button'
import {colors, Library} from '../styles'

type RemoveButtonProps = ButtonProps & {
    onClick?: () => void
}


const hoverStyle = ({disabled}) =>
    !disabled && `
        cursor: pointer;
        background-color: ${colors.BRIGHT_RED};
        box-shadow: 0 2px 2px 0 rgba(37, 37, 37, 0.24), 0 0 2px 0 rgba(37, 37, 37, 0.12);
    `

const RemoveButtonContainer = styled.button`
    background-color: ${({disabled}) => disabled ? colors.DISABLED_GRAY : colors.ACCENT_RED};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 36px;
    border: none;
    border-radius: 2px;

    &:hover {
        ${hoverStyle}
    }

    &:focus {
        outline: none;
    }
`

export const RemoveButton = (props: RemoveButtonProps) =>
    <RemoveButtonContainer {...props}>
        <Library.Delete style={{color: colors.WHITE}}/>
    </RemoveButtonContainer>

export default RemoveButton
