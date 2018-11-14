import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {ExampleSection} from './ContractorsFormSection'

declare const module
storiesOf('operations', module)
    .add('contractors form section', () =>
        <ExampleSection/>
    )
