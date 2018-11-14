import * as React from 'react'
import ReportSectionStatusButton from './ReportSectionStatusButton'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

declare const module

storiesOf('reports/parts/ReportSectionStatusButton', module)
    .add('simple button', () =>
        <>
            <div style={{padding: 20}}>
                <pre>{'onChange={action(\'onChange\')}\nvalue={true}\nsectionActive={true}'}</pre>
                <ReportSectionStatusButton
                    onChange={action('onChange')}
                    value
                    sectionActive
                />
            </div>
            <div style={{padding: 20}}>
                <pre>{'onChange={action(\'onChange\')}\nvalue={true}\nsectionActive={false}'}</pre>
                <ReportSectionStatusButton
                    onChange={action('onChange')}
                    value
                    sectionActive={false}
                />
            </div>
            <div style={{padding: 20}}>
                <pre>{'onChange={action(\'onChange\')}\nvalue={false}\nsectionActive={true}'}</pre>
                <ReportSectionStatusButton
                    onChange={action('onChange')}
                    value={false}
                    sectionActive
                />
            </div>
        </>
    )
