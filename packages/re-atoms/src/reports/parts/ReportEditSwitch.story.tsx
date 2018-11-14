import * as React from 'react'
import ReportEditSwitch from './ReportEditSwitch'
import {storiesOf} from '@storybook/react'

declare const module

storiesOf('reports/parts/ReportEditSwitch', module)
    .add('make value switch', () =>
        <div style={{width: '240px'}}>
            <ReportEditSwitch/>
        </div>
    )
