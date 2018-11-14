import * as React from 'react'
import {connect} from 'react-redux'
import {connection, credentials, FrontState} from '../store/index'
import {TextInput} from '../inputs'
import {Button} from '../controls'
import {VBox} from '../layout'
import {actions as iso, PublicMeta} from '@local/isomorphic'

import {restyle} from '../styles'
import Paper from 'material-ui/Paper'
import Div from '../layout/Div'
import colors from '../styles/colors'
import ServicePageLayout from '../layout/ServicePageLayout'

type LoginFormProps = {
    publicMeta: PublicMeta
    credentials: credentials.CredentialsState
    connection: connection.ConnectionState
    dispatch: (action: any) => any
    gatewayDisabled?: boolean
}

type LoginFormState = {
    login?: string
    password?: string
    gateway?: string
}

const LoginLabel = restyle`
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 32px;
`(Div)

const LoginPaper = restyle`
    min-width: 384px;
`(Paper)

const LoginButton = restyle`
    width: 36px;
`(Button)

const LoginContent = restyle`
    padding: 32px 32px 92px 32px;
`(Div)

const CredentialsError = restyle`
    padding: 12px 32px 12px 32px;
    font-family: Roboto;
    background-color: ${colors.PURPLE_WHITE};
    font-size: 13px;
    line-height: 1.54;
    color: ${colors.EXTRA_LIGHT_RED};
    border-bottom: 1px solid ${colors.DARK_GRAY};
`(Div)

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {

    private doLogin = () =>
        this.props.dispatch(iso.client.authRequest({}))

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <ServicePageLayout
                title={'Вход в систему'}
                label={this.props.publicMeta.name}
            >
                <VBox gap={15}>
                    <LoginPaper>
                        {
                            this.props.credentials && this.props.credentials.wrongCredentials &&
                            <CredentialsError>
                                Ошибка: Неверные логин и/или пароль
                            </CredentialsError>
                        }
                        <LoginContent>
                            <LoginLabel>
                                Введите Логин и Пароль для входа в систему
                            </LoginLabel>
                            <TextInput
                                label='Сервер'
                                disabled={this.props.gatewayDisabled}
                                value={this.props.connection.gateway || ''}
                                onChange={value =>
                                    this.props.dispatch(connection.actions.gatewayChanged(value))
                                }
                                helperText={this.props.credentials.wrongCredentials && 'Ошибка'}
                            />
                            <TextInput
                                label={'Логин'}
                                value={this.props.credentials.login || ''}
                                error={this.props.credentials.wrongCredentials}
                                onChange={value =>
                                    this.props.dispatch(
                                        credentials.actions.setCredentials({
                                            login: value
                                        })
                                    )
                                }

                            />
                            <TextInput
                                label={'Пароль'}
                                type='password'
                                value={this.props.credentials.password || ''}
                                error={this.props.credentials.wrongCredentials}
                                onChange={value =>
                                    this.props.dispatch(credentials.actions.setCredentials({password: value}))
                                }
                                helperText={this.props.credentials.wrongCredentials && 'Ошибка'}
                            />
                        </LoginContent>
                    </LoginPaper>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <LoginButton
                            primary
                            disabled={
                                !this.props.credentials.login ||
                                !this.props.credentials.password ||
                                !this.props.connection.gateway ||
                                !this.props.connection.isConnected
                            }
                            onClick={this.doLogin}
                        >
                            Вход
                        </LoginButton>
                    </div>
                </VBox>
            </ServicePageLayout>
        )
    }
}

const mapStateToProps = (state: FrontState) => ({
    credentials: state.credentials || {},
    connection: state.connection || {},
    publicMeta: state.publicMeta || {}
})

const ConnectedLoginForm = connect(mapStateToProps)(LoginForm)

export default ConnectedLoginForm
