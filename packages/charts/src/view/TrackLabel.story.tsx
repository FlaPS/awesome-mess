import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {Stage} from '../pixiFiber'
import TrackLabel from './TrackLabel'

declare const module
storiesOf('Track', module)
    .add('track label', () =>
        <Stage width={800} height={600} backgroundColor={0xffffff}>
            <TrackLabel
                text='1000'

            />
        </Stage>
    )