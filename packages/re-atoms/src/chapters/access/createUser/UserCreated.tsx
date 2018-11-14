import * as React from 'react'
import styled from 'styled-components'
import {omit} from 'ramda'
import Library from '../../../styles/SVGLibrary'
import Button from '../../../controls/Button'
import {restyle} from '../../../styles'
import Div from '../../../layout/Div'
import colors from '../../../styles/colors'

type UserCreatedProps = {
    login: string,
    password: string,
    onDoneClick: () => void,
    onPrintClick: () => void,
    onSendClick: () => void
}

const omitUserCreatedProps = omit(['login', 'password'])

const CreatedLabel = restyle`
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 14px;
`(Div)

const CreatedConfirm = restyle`
    display: flex;
    height: 24px;
    text-align: center;
    align-items: center;
    color: ${colors.SOFT_BLACK};
    font-family: Roboto;
    font-size: 16px;
`(Div)

const UserIcon = restyle`
    width: 22px;
    height: 22px;
    background-color: ${colors.DARK_GREEN};
    text-align: center;
    display: flex;
    color: ${colors.WHITE};
    justify-content: center;
    align-items: center;
    line-height:24px;
    border-radius:50%;
    margin-right: 7px;
`(Div)

const SubLabel = restyle`
    margin-top: 24px;
    height: 32px;
    width: 592px;
    display: flex;
    align-items: center;
    background-color: ${colors.LIGHT_GREY_BLUE};
    color: ${colors.SOFT_BLACK};
    font-family: Roboto;
    font-size: 13px;
    font-weight: 500;
`(Div)

const BlueIcon = restyle`
    margin-left: 16px;
    margin-right: 8px;
    color: ${colors.DEEP_BLUE};
    opacity: 0.45;
`(Library.Googblue)

const SubWindow = restyle`
    height: 127px;
    width: 568px;
    padding: 24px 0 0 24px;
    display: flex;
    flex-direction: column;
    background-color: ${colors.DARK_BLUE};
    color: ${colors.EXTRA_SOFT_BLACK};
    font-family: Roboto;
    font-size: 13px;
    line-height: 16px;
    position: fixed;
`(Div)

const PrintButton = restyle`
    position: absolute;
    top: 4px;
    right: 4px;
    color: ${colors.SOFT_BLACK};
`(Div)

const LinkRow = restyle`
    display: flex;
    flex-direction: column;
`(Div)

const UserLink = styled.a`
    color: ${colors.DEEP_BLUE};
    font-family: Roboto;
    font-size: 16px;
    margin-top: 5px;
`

const LoginRow = restyle`
    display: flex;
    margin-top: 23px;
`(Div)

const LoginBox = restyle`
    margin-right: 24px;
    min-width: 100px;
`(Div)

const UserData = restyle`
    color: ${colors.DARK_BLACK};
    font-family: Roboto;
    font-size: 16px;
    line-height: 24px;
    margin-top: 4px;
`(Div)

const ButtonRow = restyle`
    position: relative;
    margin-top: 159px;
    right: -16px;
    display: flex;
    flex-direction: row-reverse;
    color: ${colors.PRIMARY};
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    line-height: 10px;
`(Div)

const OffsetDiv = restyle`
    width:8px;
`(Div)

const UserCreated = styled((props: UserCreatedProps) => (
    <div {...omitUserCreatedProps(props)}>
        <CreatedLabel> Создание нового пользователя</CreatedLabel>
        <CreatedConfirm>
            <UserIcon>
                <Library.Done/>
            </UserIcon>
            {'Пользователь с логином ' + props.login + ' создан успешно!'}
        </CreatedConfirm>
        <SubLabel>
            <BlueIcon/>
            Данные для авторизации в системе
        </SubLabel>
        <SubWindow>
            <PrintButton>
                <Button color='inherit' onClick={props.onPrintClick}>
                    <Library.Print style={{marginRight: '8px'}}/>
                    Печать
                </Button>
            </PrintButton>
            <LinkRow>
                Ссылка для входа в систему
                <UserLink href='https://www.renode.com/account/user'>https://www.renode.com/account/user</UserLink>
            </LinkRow>
            <LoginRow>
                <LoginBox>
                    Логин
                    <UserData>{props.login}</UserData>
                </LoginBox>
                <div>
                    Пароль
                    <UserData>{'*'.repeat(props.password.length)}</UserData>
                </div>
            </LoginRow>
        </SubWindow>
        <ButtonRow>
            <Button color='inherit' onClick={props.onSendClick}>Отправить данные</Button>
            <OffsetDiv/>
            <Button color='inherit' onClick={props.onDoneClick}>Готово</Button>
        </ButtonRow>
    </div>
))`
    height: 320px;
    width: 592px;
    border-radius: 2px;
    background-color: ${colors.WHITE};
    box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px 0 rgba(0,0,0,0.2);
    padding: 22px 24px 0 24px;
`

export default UserCreated
