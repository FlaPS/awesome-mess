import * as React from 'react'
import IconButton from 'material-ui/IconButton'
import {Library} from '../styles/SVGLibrary'
import {restyle} from '../styles'
import {body1} from '../styles/font'
import Span from '../layout/Span'
import {RegularBadgeProps} from './BadgeExtended'
import {omit} from 'ramda'
import {CreateBadgeProps} from './CreatingBadge'

const grayColor = 'rgba(0,0,0,0.38)'
const grayTextColor = 'rgba(0,0,0,0.54)'
const buttonStyle = {width: 24, height: 24, flex: 'none', marginLeft: 8}
const forIcon = omit(['flex', 'marginLeft'])

const Badge = body1(restyle`
    max-width: 100%;
    box-sizing: border-box;
    height: 32px;
    font-size: 13px;
    line-height: 32px;
    text-align: center;

    border-radius: 100px;
    border-width: 1px;

    margin: 0 6px 8px 0;
    padding: 0 12px;
`)(Span)

export const RegularBadge = restyle`
    ${({disabled}) => !disabled ? `
        display: flex;
        align-items: center;

        padding: 4px 4px 4px 12px;
    ` : ''}

    background-color: ${({color}) => color};
    border-color: ${({color}) => color};
    border-style: solid;
    color: white;
`(Badge) as React.StatelessComponent<RegularBadgeProps>

export const Label = restyle`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 0 1 auto;
    max-width: 100%;
    box-sizing: border-box;
    display: inline-block;
`(Span)

export const AddBadge = restyle`
    display: flex;
    align-items: center;
    padding: 0 4.5px 0 12.5px;
    color: ${grayTextColor};
    border-color: ${grayColor};
    border-style: dashed;
    cursor: pointer;
`(Badge) as React.StatelessComponent<CreateBadgeProps>

export const RemoveIcon = props =>
    <IconButton style={{...buttonStyle}} {...props} >
        <Library.DeleteCross style={{...forIcon(buttonStyle)}} fill='white'/>
    </IconButton>

export const AddIcon = props =>
    <IconButton style={{...buttonStyle}} {...props} >
        <Library.AddButton style={{...forIcon(buttonStyle)}} fill={grayColor}/>
    </IconButton>
