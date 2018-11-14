import * as React from 'react'
import DocumentNumberStepper from './DocumentNumberStepper'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

declare const module

const data = ['1', '2', '3']

storiesOf('reports/parts/DocumentNumberStepper', module)
    .add('simple stepper', () =>
        <>
            <div style={{padding: 20}}>
                <DocumentNumberStepper
                    onChange={action('onChange')}
                    data={data}
                    value={data[1]}
                />
            </div>
            <div style={{padding: 20}}>
                <DocumentNumberStepper
                    onChange={action('onChange')}
                    data={data}
                    value={data[0]}
                />
            </div>
            <div style={{padding: 20}}>
                <DocumentNumberStepper
                    onChange={action('onChange')}
                    data={data}
                    value={data[2]}
                />
            </div>
        </>
    )
