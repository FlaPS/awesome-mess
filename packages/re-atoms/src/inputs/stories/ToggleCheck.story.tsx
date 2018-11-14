import * as React from 'react'
import {storiesOf} from '@storybook/react'
import ToggleCheck from '../ToggleCheck'
import {Library} from '../../styles/SVGLibrary'

declare const module
storiesOf('Inputs/ToggleCheck', module)
    .add('ToggleCheck', () => (
        <ToggleCheck
            icon={<Library.Edit/>}
        />))
