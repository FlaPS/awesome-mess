import * as React from 'react'
import Switch, {SwitchProps} from './Switch'
import {Div, HBox} from '../layout'
import {colors, Font, restyle} from '../styles'


const Label = restyle`
	height: 15px;
	min-width: 320px;
	color: ${colors.DEFAULT_BLACK};
	font-size: 13px;
	line-height: 15px;
`(Font.FontFamily(Div))

export default ({label, helpText, ...props}: SwitchProps & { label: string, helpText?: string }) =>
    <HBox stretch style={{alignItems: 'center'}}>
        <Label>{label}</Label>
        <HBox stretch/>
        <Switch {...props}/>
    </HBox>
