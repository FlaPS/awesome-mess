import {compose} from 'ramda'
import {restyle} from './restyle'
import {DEFAULT_BLACK, EXTRA_SOFT_BLACK, SOFT_BLACK} from './colors'

export const FontFamily = restyle`font-family: "Roboto", "Helvetica", "Arial", sans-serif;`

const composeStyles =
    (...args) =>
        (restyled = restyle``) =>
            compose(restyled, ...args, FontFamily)

export const FontSize = (size: number) => restyle`font-size: ${size}px;`
export const FontWeight = (weight: number) => restyle`font-weight: ${weight};`
export const LineHeight = (lineheight: number) => restyle`line-height: ${lineheight};`
export const Color = (color: string) => restyle`color: ${color};`
export const Margin = (...args) =>
    restyle`margin:${args.reduce((str, arg) => `${str} ${arg ? `${arg}px` : arg}`, '')};`

export const F12 = FontSize(12)
export const F14 = FontSize(14)
export const F16 = FontSize(16)
export const F21 = FontSize(21)
export const F24 = FontSize(24)
export const F34 = FontSize(34)
export const F45 = FontSize(45)
export const F56 = FontSize(56)
export const F112 = FontSize(112)

export const FW300 = FontWeight(300)
export const FW400 = FontWeight(400)
export const FW500 = FontWeight(500)

export const LH1 = LineHeight(1)
export const LH1_07 = LineHeight(1.07)
export const LH1_35 = LineHeight(1.35)
export const LH1_18 = LineHeight(1.18)
export const LH1_5 = LineHeight(1.5)
export const LH1_71 = LineHeight(1.71)
export const LH1_43 = LineHeight(1.43)
export const LH1_33 = LineHeight(1.33)

export const MB0 = Margin(0)

export const DefaultBlack = Color(DEFAULT_BLACK)
export const SoftBlack = Color(SOFT_BLACK)
export const ExtrasoftBlack = Color(EXTRA_SOFT_BLACK)


export const display4 = composeStyles(F112, FW300, SoftBlack, LH1)
export const display3 = composeStyles(F56, FW400, SoftBlack, LH1_35)
export const display2 = composeStyles(F45, FW400, SoftBlack, LH1_07)
export const display1 = composeStyles(F34, FW400, SoftBlack, LH1_18)
export const headLine = composeStyles(F24, FW400, DefaultBlack, LH1_33, MB0)
export const title = composeStyles(F21, FW500, DefaultBlack, LH1)
export const subheading = composeStyles(F16, FW400, DefaultBlack, LH1_5)
export const subheadingBold = composeStyles(F16, FW500, LineHeight(1.1875))
export const body2 = composeStyles(F14, FW500, DefaultBlack, LH1_71)
export const body1 = composeStyles(F14, FW400, DefaultBlack, LH1_43)
export const caption = composeStyles(F12, FW400, SoftBlack, LH1)
export const caption2 = composeStyles(F14, FW400, SoftBlack, LH1_07)
export const button = composeStyles(F14, FW500, SoftBlack, LH1_43)
