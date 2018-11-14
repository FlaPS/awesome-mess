import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import TabNavigator from './TabNavigator'
import {restyle} from '../styles'
import Div from './Div'

import {compose, withHandlers, withState} from 'recompose'
import Library from '../styles/SVGLibrary'
import {IconButton} from '../controls/index'

const PaneContainer = restyle`
    padding: 20px 30px;
    font-size: 15px;
`(Div)

const enhance = compose(
    withState('value', 'updateValue', 0),
    withHandlers({
        onChange: props => event => {
            // @ts-ignore
            props.updateValue(event)
        },
    })
)

// @ts-ignore
const ControllingTabNavigator = enhance(({value, onChange}) => [
    // @ts-ignore
    <TabNavigator key='one' value={value} onChange={onChange}>
        <TabNavigator.Pane title='one'>
            <PaneContainer>one</PaneContainer>
        </TabNavigator.Pane>
        <TabNavigator.Pane title='two'>
            <PaneContainer>two</PaneContainer>
        </TabNavigator.Pane>
        <TabNavigator.Pane title='three'>
            <PaneContainer>three</PaneContainer>
        </TabNavigator.Pane>
    </TabNavigator>,
    <pre key='two'>current pane is #{value}</pre>,
])

const makeButton = icon =>
    <IconButton onClick={action('click')}>
        {icon()}
    </IconButton>

const GlobalExtra = () => makeButton(() => <Library.Hamburger/>)
const LocalExtra = () => makeButton(() => <Library.Dots/>)

declare const module
storiesOf('layout/TabNavigator', module)
    .add('UnControlling TabNavigator', () =>
        <TabNavigator>
            <TabNavigator.Pane title='one'>
                <PaneContainer>one</PaneContainer>
            </TabNavigator.Pane>
            <TabNavigator.Pane title='two'>
                <PaneContainer>two</PaneContainer>
            </TabNavigator.Pane>
            <TabNavigator.Pane title='three'>
                <PaneContainer>three</PaneContainer>
            </TabNavigator.Pane>
        </TabNavigator>
    )
    .add('Controlling TabNavigator', () =>
        <ControllingTabNavigator/>
    )
    .add('TabNavigator with extra', () =>
        <TabNavigator extra={GlobalExtra}>
            <TabNavigator.Pane title='one'>
                one
            </TabNavigator.Pane>
            <TabNavigator.Pane title='two' extra={LocalExtra}>
                two
            </TabNavigator.Pane>
            <TabNavigator.Pane title='three'>
                three
            </TabNavigator.Pane>
        </TabNavigator>
    )
