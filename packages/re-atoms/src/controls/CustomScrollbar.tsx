import * as React from 'react'
import styled from 'styled-components'
import colors from '../styles/colors'

export default styled.div`
    ${({height}) => typeof height === 'undefined' ? '' : `
        max-height: ${height}px;
        height: 100%;
    `}
    overflow-y: auto;
    overflow-x: hidden;

    background:
        -webkit-linear-gradient(top, white 30%,rgba(255,255,255,0) 100%),
        -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, white 30%) bottom,
        -webkit-radial-gradient(50% 0, ellipse cover, hsla(0,0%,0%,0.4) 30%, transparent 70%),
        -webkit-radial-gradient(50% 100%, ellipse cover, hsla(0,0%,0%,0.4) 30%, transparent 70%) bottom;
    background-size:100% 40px,100% 40px,110% 14px,110% 14px;
    background-repeat: no-repeat;
    background-attachment: local, local, scroll, scroll;
    background-color: ${colors.WHITE};

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        width: 3px;
        background-color: ${colors.BLACK_GRAY};
    }
`
