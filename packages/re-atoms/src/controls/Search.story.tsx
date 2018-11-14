import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import Search from './Search'

declare const module
storiesOf('Controls/search', module)
    .add('simple search', () =>
        <Search
            style={{marginLeft: '20%', marginTop: '10%'}}
            value={''}
            onChange={action('value')}
        />
    )
    .add('white search', () =>
        <Search
            value={''}
            onChange={action('value')}
            isWhite
        />
    )
