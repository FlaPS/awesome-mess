import * as React from 'react'
import {Provider, ProviderProps} from 'react-redux'
import getStore from './store'

export default (props: ProviderProps) =>
    <Provider store={props.store || getStore()} {...props}>
        {props.children}
    </Provider>