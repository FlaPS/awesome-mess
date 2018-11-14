import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {dispatch, getStore} from './configureStore'
import {seedBiz} from '@local/biz'

window['dispatch'] = dispatch

const addUser = () => {
    seedBiz(getStore())
}

