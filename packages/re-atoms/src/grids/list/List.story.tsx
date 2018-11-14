import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {makeList} from './List'
import {WELL} from '@local/biz'
import getStore from '../../store/'
import {toIndexedArray} from '@local/utils'
import makeValue from '../../smart/makeValue'

const ItemList = makeList(WELL)
const ControlledList = makeValue<string[]>().ap(props =>
    <ItemList data={toIndexedArray(getStore().getState().biz.wells)} {...props} />
)

declare const module
storiesOf('List', module)
    .add('Simple list', () =>
        <ItemList data={toIndexedArray(getStore().getState().biz.wells)}/>
    )
    .add('Multi select list', () =>
        <ControlledList mode='multiSelect'/>
    )
    .add('Select list', () =>
        <ControlledList mode='select'/>
    )
