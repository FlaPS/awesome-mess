import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import GroupingControl from './GroupingControl'
import Paper from '../layout/Paper'

const data = ['Проекты', 'Месторождения', 'Лицензионные участки']

declare const module
storiesOf('Controls/grouping control', module)
    .add('custom grouping control', () => (
        <Paper>
            <div style={{width: '690px'}}>
                <GroupingControl data={data} onChange={action('onChange')}/>
            </div>
        </Paper>
    ))
