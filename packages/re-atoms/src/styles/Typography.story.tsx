import * as React from 'react'
import {addDecorator, storiesOf} from '@storybook/react'

import {Body1, Body2, Caption, Display1, Display2, Display3, Display4, HeadLine, Subheading, Title} from './Typography'

import styled from 'styled-components'
import {restyle} from './restyle'

const Wrapper = styled.div`
    background-color: #eee;
    max-width: 500px;
    margin: auto;
    padding: 10px 50px;
`

const WideBody = restyle`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`(Body1)

const LikeButton = restyle`
    text-transform: uppercase;
    padding: 3px 10px;
    border: 1px solid gray;
    background-color: rebeccapurple;
    color: white;
    display: inline-block;
    margin-bottom: 0;
`(Body2)

declare const module
storiesOf('styles/Typography', module)
    .add('example', () =>
        <Wrapper>
            <Display4>Display4</Display4>
            <Display3>Display3</Display3>
            <Display2>Display2</Display2>
            <Display1>Display1</Display1>
            <HeadLine>Headline</HeadLine>
            <Title>Title</Title>
            <Subheading>Subheading</Subheading>
            <Body2>Body2</Body2>
            <Body1>Body1</Body1>
            <Caption>Caption</Caption>
            <WideBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </WideBody>
            <LikeButton>I'm span, but looks like a button</LikeButton>
        </Wrapper>
    )
