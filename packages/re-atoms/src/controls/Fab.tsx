import * as React from 'react'

import Button, {ButtonProps} from './Button'
import styled from 'styled-components'
import {Div} from '../layout'
import {colors} from '../styles'


const FloatDiv = styled(Div)`
    position: fixed;
    bottom: 72px;
    right: 72px;
`

const staticButtonStyle = {boxShadow: 'none', color: colors.WHITE}

type FabProps = ButtonProps & { children?: React.ReactNode } & {
    staticPosition?: boolean
}

export default ({staticPosition, ...props}: FabProps) =>
    staticPosition
        ? (
            <Button style={staticButtonStyle} fab {...props} primary/>
        ) : (
            <FloatDiv>
                <Button fab {...props} primary/>
            </FloatDiv>
        )
