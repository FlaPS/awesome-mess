import * as React from 'react'
import {storiesOf} from '@storybook/react'
import CustomScrollbar from './CustomScrollbar'

declare const module
storiesOf('layout/CustomScroll', module)
    .add('custom bar', () => (
        <CustomScrollbar>
            <div style={{height: '150vh'}}>
                123
            </div>
        </CustomScrollbar>
    ))

