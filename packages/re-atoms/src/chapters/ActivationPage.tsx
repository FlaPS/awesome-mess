import * as React from 'react'
import {connect} from 'react-redux'
import {connection, FrontState} from '../store/index'
import {TextInput} from '../inputs'
import {Button} from '../controls'
import {VBox} from '../layout'
import * as iso from '@local/isomorphic'

import {restyle} from '../styles'
import Paper from 'material-ui/Paper'
import Div from '../layout/Div'
import colors from '../styles/colors'
import ServicePageLayout from '../layout/ServicePageLayout'

type LoginFormProps = {
    activation: iso.activation.ActivationState
    connection: connection.ConnectionState
    dispatch: (action: any) => any

}

type LoginFormState = {
    masterAddress?: string
    key?: string
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

const isOkValue = str => str !== null && str !== undefined && str.length > 0

class ActivationForm extends React.Component<LoginFormProps, LoginFormState> {

    private doLogin = () =>
        this.props.dispatch(iso.actions.client.requestActivation({
            key: this.state.key,
            masterAddress: this.state.masterAddress
        }))

    constructor(props) {
        super(props)
        this.state = {
            key: this.props.activation.key,
            masterAddress: this.props.activation.masterAddress
        }
    }

    render() {
        return (
            <ServicePageLayout
                title={'Активация скважины'}
                label={'Центральный сервер'}
            >
                <VBox gap={15}>
                    <LoginPaper>
                        <LoginContent>
                            <LoginLabel>
                                Введите адрес центрального сервера и ключ скважины
                            </LoginLabel>
                            <TextInput
                                label='Адрес центрального сервера'
                                value={this.state.masterAddress || ''}
                                onChange={value =>
                                    this.setState({masterAddress: value})
                                }
                                helperText={this.props.activation.masterError && 'центральный сервер не найден'}
                            />
                            <TextInput
                                label={'Лицензионный ключ'}
                                value={this.state.key || ''}
                                onChange={value =>
                                    this.setState({key: value})
                                }
                                helperText={this.props.activation.keyError && 'не верный ключ'}

                            />
                        </LoginContent>
                    </LoginPaper>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <LoginButton
                            primary
                            style={{width: '180px'}}
                            disabled={
                                !isOkValue(this.state.key) || !isOkValue(this.state.masterAddress)
                            }
                            onClick={this.doLogin}
                        >
                            Активировать
                        </LoginButton>
                    </div>
                </VBox>
            </ServicePageLayout>
        )
    }
}

const mapStateToProps = (state: FrontState) => ({
    activation: state.publicMeta.activation,
    connection: state.connection,
})

const ConnectedActivationForm = connect(mapStateToProps)(ActivationForm)

export default ConnectedActivationForm
