import * as React from 'react'
import {storiesOf} from '@storybook/react'

import Toggle from './Toggle'
import Button from '../controls/Button'

declare const module
storiesOf('PureToggle', module)
    .add('Toggle & count ', () =>
        <Toggle on={true}>
            {
                props =>
                    <Button
                        raised={props.on}
                        onMouseDown={props.onToggle}
                    >
                        I'll change the state by a click {props.counter}
                    </Button>
            }
        </Toggle>
    )
