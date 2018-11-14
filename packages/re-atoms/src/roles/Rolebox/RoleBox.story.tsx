import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {RoleBox, RoleBoxDisconnected, RoleBoxProps} from './RoleBox'
import {take} from 'ramda'

import {Provider} from 'react-redux'
import getStore from '../../store/'
import {ROLE, sel} from '@local/biz'
import withErrorHandler from '../../misc/ErrorHandlerHOC'

const values = sel(ROLE).asKeys()()
const Error = props => <div>error</div>

const RoleBoxHandled = withErrorHandler<RoleBoxProps>(action('error'), Error, RoleBox)

declare const module
storiesOf('RoleBox', module)
    .add('All roles', () =>
        <Provider store={getStore()}>
            <RoleBoxHandled values={values}/>
        </Provider>
    )
    .add('3 roles, aligned to center', () =>
        <Provider store={getStore()}>
            <RoleBox style={{textAlign: 'center'}} values={take(3, values)}/>
        </Provider>
    )
    .add('4 roles, aligned to right', () =>
        <Provider store={getStore()}>
            <RoleBox style={{textAlign: 'right'}} values={take(4, values)}/>
        </Provider>
    )
    .add('3 roles, aligned to right, max-width: 50%', () =>
        <Provider store={getStore()}>
            <RoleBox style={{textAlign: 'center', maxWidth: '50%'}} values={take(3, values)}/>
        </Provider>
    )
    .add('6 roles with max-width: 200px', () =>
        <Provider store={getStore()}>
            <RoleBox style={{maxWidth: 200}} values={take(6, values)}/>
        </Provider>
    )
    .add('New role', () =>
        <RoleBoxDisconnected
            values={['0']}
            roles={{['0']: {color: '#00FF00', roleId: '15', name: 'Petya'}}}
        />
    )
