import * as React from 'react'
import {storiesOf} from '@storybook/react'


declare const module
storiesOf('Index', module)
    .add('index story', () =>
        <div> Hi</div>
    )