import {restyle} from '../styles'
import Div, {DivProps} from './Div'
import styled from 'styled-components'
import * as React from 'react'
import {compose, omit} from 'ramda'
import {mapProps} from 'recompose'
import colors from '../styles/colors'
import declareProps from '../smart/declareProps'
import {Renderable} from '../smart/renderChildren'

type CSSMetric = number | string


export type BoxProps =
    DivProps
    & {

    gap?: CSSMetric
    width?: CSSMetric
    height?: CSSMetric
    stretch?: boolean
    marginAuto?: boolean
    reversed?: boolean
    bottomBorder?: boolean
    topBorder?: boolean
    children: Renderable<any>
}

const omitProps = compose(mapProps, omit)

const omitBoxProps = omitProps(['gap', 'stretch', 'marginAuto', 'reversed', 'bottomBorder', 'topBorder'])


const metrics = (prop, cssProp?) => props =>
    props[prop] &&
    (cssProp || prop) + ': ' + (isNaN(props[prop])
    ? props[prop]
    : props[prop] + 'px') + ';'

const getMarginAuto = props =>
    props.marginAuto
        ? 'margin: auto;'
        : ''

const widthMetric = props =>
    props.stretch
        ? 'width: 100%;'
        : metrics('width')(props)

export const overlay = restyle`
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.54);
`

export const VBox: React.SFC<BoxProps> =
    styled(declareProps<BoxProps>(
        [
            'gap',
            'stretch',
            'marginAuto',
            'reversed',
            'bottomBorder',
            'topBorder',
        ])(Div))`
    box-sizing: border-box;
    display:flex;
    flex-direction: column;
    border-bottom: ${props => props.bottomBorder ? `1px solid ${colors.LIGHT_BORDER_GRAY}` : 'none'};
    ${ widthMetric }
    ${ metrics('height') }
    ${ getMarginAuto }
    > div:not(:first-child){
     ${ metrics('gap', 'margin-top') };
    }
    > button:not(:first-child){
     ${ metrics('gap', 'margin-top') };
    }
` as any


export const HBox: React.SFC<BoxProps> =
    styled(declareProps<BoxProps>(
        [
            'gap',
            'stretch',
            'marginAuto',
            'reversed',
            'bottomBorder',
            'topBorder',
        ])(Div))`
    box-sizing: border-box;
    display:flex;
    flex-direction: ${ props => props.reversed ? 'row-reverse' : 'row'};
    border-top: ${props => props.topBorder ? `1px solid ${colors.LIGHT_BORDER_GRAY}` : 'none'};
    border-bottom: ${props => props.bottomBorder ? `1px solid ${colors.LIGHT_BORDER_GRAY}` : 'none'};
    ${ widthMetric }
    ${ metrics('height') }
    ${ getMarginAuto }
    > div:not(:first-child){
        ${ metrics('gap', 'margin-left') }
    }
    > button:not(:first-child){
        ${ metrics('gap', 'margin-left') }
    }
` as any
