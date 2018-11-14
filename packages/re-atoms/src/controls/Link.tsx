import * as React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import colors from '../styles/colors'

export default styled(Link)`
    text-align: center;
    color: ${colors.PALE_VIOLET_RED};
    font-size: 12px;
    text-decoration: ${({decoration}) => decoration ? 'underline' : 'none'};
`

