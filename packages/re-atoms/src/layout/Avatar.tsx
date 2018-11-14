import * as React from 'react'
import styled from 'styled-components'
import Div from './Div'
import {colors} from '../styles'

export const Avatar = styled(Div)`
    min-height: ${({height}) => height}px;
    min-width: ${({width}) => width}px;
    background-color: ${colors.AVATAR_GRAY};
`
