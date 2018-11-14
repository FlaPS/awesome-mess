import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {schemes} from '@local/biz'
import App from './App'
import {AppContainer} from 'react-hot-loader'
//seedBiz(getStore())
window['schemes'] = schemes

let isRendered = false

export const isAppRendered = () => true
const rootElement = document.getElementById('root')

export const render = Component =>
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>
        , rootElement
    )

render(App)

declare const module: any
if (module.hot)
    module.hot.accept('./App', () => {
        render(App)
    })


/*
if (['module']['hot']) {
    ['module']['hot'].accept()
    renderApp()
} else {
    renderApp()
}*/

