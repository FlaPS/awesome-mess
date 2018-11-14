import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {Container, DisplayObjectProps} from '../pixiFiber'


type DepthTrackProps = DisplayObjectProps & {
    axisStart: number
    axisEnd: number
    width: number
    height: number
}

export default class DepthTrack extends React.Component<DepthTrackProps, any> {
    render() {
        return <Container>
        </Container>
    }
}