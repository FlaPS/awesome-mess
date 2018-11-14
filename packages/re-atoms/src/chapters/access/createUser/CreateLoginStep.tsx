import * as React from 'react'
import Card from '../../../Card'
import {restyle} from '../../../styles/restyle'
import Div from '../../../layout/Div'
import TextInput from '../../../inputs/TextInput'
import Button from '../../../controls/Button'
import {HBox, VBox} from '../../../layout/Box'
import Typography from 'material-ui/Typography'
import Switch from '../../../inputs/Switch'
import {bindInput} from '../../../smart/form/bindInput'
import {formPure} from '../../../smart/Form'
import {USER} from '@local/biz'
import * as Rand from '@local/random'

const Pane = restyle`
    width:424px;
    padding: 32px;
`(Card)

const Caption = restyle`
	color: rgba(0,0,0,0.87);
	font-family: Roboto;
	font-size: 15px !important;
	line-height: 24px;
`(Div)

const GenerateButton = restyle`
    margin: 0 -16px;
`(Button)

const LoginForm = formPure(USER, ['login', 'password', 'isMasterUser'])

export const CreateLoginStep = LoginForm.ap(props => {

        const randomPassword = () =>
            props.onChange({
                property: 'password',
                value: Rand.generatePassword(),
            })

        const description = props.model.isMasterUser
            ? `
                Пользователю будет разрешено авторизоваться
                как на центральном сервере, так и на буровых.
                При входе в систему пользователь установит свой пароль
            ` : `
                Пользователю будет разрешено авторизоваться только на
                буровых. При входе в систему пользователь будет
                использовать установленный Вами пароль
            `

        return (
            <Pane>
                <VBox gap={36}>
                    <Caption>Создайте логин и пароль для авторизации<br/> пользователя в системе</Caption>
                    <TextInput {...bindInput('login')(props)} label='Логин'/>
                    <TextInput  {...bindInput('password')(props)} label='Пароль'/>
                    <HBox stretch reversed style={{margin: '20px 0 10px'}}>
                        <GenerateButton color='primary' onClick={randomPassword}>
                            СГЕНЕРИРОВАТЬ ПАРОЛЬ
                        </GenerateButton>
                    </HBox>
                    <Switch {...bindInput('isMasterUser')(props)} label='Авторизация на сервере'/>
                    <Typography type='caption' gutterBottom>
                        {description}
                    </Typography>
                </VBox>
            </Pane>
        )
    }
)


export default CreateLoginStep

