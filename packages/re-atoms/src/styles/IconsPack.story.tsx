import * as React from 'react'
import {storiesOf} from '@storybook/react'
import AllIconsPack from './allIconsPack'

declare const module
storiesOf('Icon pack', module)
    .add('all Icons', () => <AllIconsPack/>)
