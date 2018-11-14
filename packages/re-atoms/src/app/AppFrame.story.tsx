import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {AppFrame} from './AppFrame'

declare const module
storiesOf('AppFrame', module)
    .add('Regular1', () =>
        <AppFrame/>
    )
