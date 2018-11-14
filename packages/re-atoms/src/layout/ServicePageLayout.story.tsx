import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import ServicePageLayout from './ServicePageLayout'
import {restyle} from '../styles'
import Paper from 'material-ui/Paper'
import LoginView from '../chapters/LoginPage'
import {Provider} from 'react-redux'
import getStore from '../store/'

declare const module
storiesOf('layout/servicePageLayout', module)
    .add('simple servicePageLayout', () =>
        <Provider store={getStore()}>
            <ServicePageLayout
                title={'очень длинный  длииииииинный длииииииинный тайтл'}
                label={'не менее длииииииинный длииииииинный длииииииинный лейбл'}
                children={<MyPaper/>}
            />
        </Provider>)
    .add('Login layout', () =>
        <Provider store={getStore()}>
            <ServicePageLayout
                title={'Вход в систему'}
                label={'Скважина 123'}
                children={<LoginView/>}
            />
        </Provider>)

const MyPaper = restyle`
    width: 300px;
    height: 500px;
`(Paper)
