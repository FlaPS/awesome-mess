import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {Text} from '../pixiFiber'
import {Text as TextProps, TextStyle} from 'pixi.js'

const trackLabelStyle = new TextStyle({
    align: 'right',
    fontSize: '10px',
})

export default (props: Partial<TextProps>) =>
    <Text {...props} style={trackLabelStyle} anchor={{x: 1, y: 1}} x={200} y={200}/>
