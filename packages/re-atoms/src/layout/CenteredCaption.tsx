import * as React from 'react'
import {DivProps} from './Div'
import styled from 'styled-components'
import {Spans} from './Span'

const Centered = styled.div`
    margin: auto;
    width: 100%
    height: 100%;
    min-height: 100px;
    text-align: center;
`

export default (text: string): React.ComponentType<DivProps> =>
    (props: DivProps) =>
        <Centered {...props}>
            <br/>
            <Spans.Caption2 style={{margin: 'auto'}}>{text}</Spans.Caption2>
        </Centered>
