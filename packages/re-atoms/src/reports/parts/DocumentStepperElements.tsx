import * as React from 'react'
import {IconButton} from '../../controls'
import {colors as C, Font, Library, restyle} from '../../styles'
import {Div, Span} from '../../layout'

export const Container = restyle`
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    background-color: ${C.MEDIUM_GRAY};
    border: solid 1px ${C.AVATAR_GRAY};
`(Div)

const Button = restyle`
    width: 24px !important;
    height: 24px !important;
`(IconButton)

export const Number = Font.subheadingBold(restyle`
    display: inline-block;
    color: ${C.SOFT_BLACK};
    padding-right: 4px;
`)(Span)

export const Caption = Font.body1(restyle`
    display: flex;
    align-items: center;
    padding: 0 8px;
`)(Span)

export const ButtonLeft = props =>
    <Button {...props}>
        <Library.ArrowLeft/>
    </Button>

export const ButtonRight = props =>
    <Button {...props}>
        <Library.ArrowRight/>
    </Button>
