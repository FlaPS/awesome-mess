import * as React from 'react'
import * as moment from 'moment'
import getFrontendStore, {browserHistory, history} from '../store/'
import {seedBiz} from '@local/biz'
import AppRouter from './AppRouter'
//import {default as theme} from '../styles/muiTheme'
import FrontendProvider from '../FrontendProvider'

moment.locale('RU')

if (getFrontendStore().getState().frontConfig.env === 'storybook') {
    seedBiz(getFrontendStore())
}

export default class extends React.Component<any, any> {


    componentDidMount() {
        window.onpopstate = e => {
            const historyLength = getFrontendStore().getState().history.appHistory.length
            if (historyLength > 2) {
                const previousLocation = getFrontendStore().getState().history.appHistory[historyLength - 3]
                if (browserHistory.location.pathname === previousLocation)
                    getFrontendStore().dispatch(history.actions.pop())
            }
        }
    }

    /*
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <FrontendProvider store={getFrontendStore()}>
                    <AppRouter />
                </FrontendProvider>
            </MuiThemeProvider>
        )
    }*/
    render() {
        return (
            <FrontendProvider store={getFrontendStore()}>
                <AppRouter/>
            </FrontendProvider>
        )
    }
}
