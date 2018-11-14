import * as React from 'react'
import DocumentDateStepper from './DocumentDateStepper'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import * as moment from 'moment'

declare const module

const getDate = offset => moment().add(offset, 'days').toString()

const data = [getDate(-1), getDate(0), getDate(1)]

storiesOf('reports/parts/DocumentDateStepper', module)
    .add('simple stepper', () =>
        <>
            <div style={{padding: 20}}>
                <DocumentDateStepper
                    onChange={action('onChange')}
                    data={data}
                    value={data[1]}
                />
            </div>
            <div style={{padding: 20}}>
                <DocumentDateStepper
                    onChange={action('onChange')}
                    data={data}
                    value={data[0]}
                />
            </div>
            <div style={{padding: 20}}>
                <DocumentDateStepper
                    onChange={action('onChange')}
                    data={data}
                    value={data[2]}
                />
            </div>
        </>
    )
