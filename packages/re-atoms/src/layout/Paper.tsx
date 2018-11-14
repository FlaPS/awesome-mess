import * as React from 'react'
import MUIPaper from 'material-ui/Paper'
import {DivProps} from './Div'


type PaperProps = DivProps
    & {
    component?: React.ReactType
    elevation?: number
    square?: boolean
}

export default (props: PaperProps) =>
    <MUIPaper {...props} />
