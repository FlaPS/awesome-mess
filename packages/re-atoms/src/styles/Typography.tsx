import * as React from 'react'

import * as Font from './font'
import {restyle} from './restyle'

import Div from '../layout/Div'
import H1 from '../layout/H1'


export const Display4 = Font.display4()(H1) as any as React.SFC<any>
export const Display3 = Font.display3()(H1) as any as React.SFC<any>
export const Display2 = Font.display2()(H1) as any as React.SFC<any>
export const Display1 = Font.display1()(H1) as any as React.SFC<any>
export const HeadLine = Font.headLine()(Div) as any as React.SFC<any>
export const Title = Font.title()(Div) as any as React.SFC<any>
export const Subheading = Font.subheading()(Div) as any as React.SFC<any>
export const Body2 = Font.body2()(Div) as any as React.SFC<any>
export const Body1 = Font.body1(restyle`text-align: right;`)(Div) as any as React.SFC<any>
export const Caption = Font.caption(restyle`text-align: center;`)(Div) as any as React.SFC<any>
export const Caption2 = Font.caption2()(Div) as any as React.SFC<any>
