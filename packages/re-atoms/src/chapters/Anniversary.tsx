import * as React from 'react'
import {Library} from '../styles/SVGLibrary'
import styled from 'styled-components'

const Styled = styled.div`
    background: url(/anniversary.jpg) no-repeat center center fixed;
    background-size: cover;
    width: 100%;
    height: calc(100vh - 54px);
    filter: opacity(90%);
`

const Anniversary = () => <Styled>{null}</Styled>

export const anniversary = {
    index: {
        component: Anniversary,
        path: '/app/anniversary',
        innerIndex: '/app/anniversary',
        icon: <Library.Help/>,
        label: 'Раскрыть тему',
        title: 'Нам 10 лет',
    },
}

export default Anniversary
