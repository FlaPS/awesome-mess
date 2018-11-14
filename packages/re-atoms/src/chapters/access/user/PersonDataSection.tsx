import * as React from 'react'
import styled from 'styled-components'
import Library from '../../../styles/SVGLibrary'
import Switch from '../../../inputs/Switch'
import TextInput from '../../../inputs/TextInput'
import {USER, UserVO} from '@local/biz'
import {formPure} from '../../../smart/Form'
import {bindInput} from '../../../smart/form/bindInput'
import {FormSection} from '../../../layout/FormSection'
import {HBox} from '../../../layout/Box'
import Tooltip from 'material-ui/Tooltip'
import {DEFAULT_BLACK} from '../../../styles/colors'


const StyledPersonData = styled.div`
    max-width: 828px;
    width: 100%;

    &:hover .hover {
        opacity: 1;
    }

    .personalAvatar {
        width: 120px;
        height: 150px;
        margin
        background-color: #E1E2E1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hover {
        cursor: pointer;
        position: relative;
        z-index: 1;
        top: 8px;
        right: -64px;
        width: 60px;
        height: 48px;
        border-radius: 0 2px 0 0;
        background-color: rgba(245,245,246,0.7);
        color: #0094CC;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .authorization {
        color: #0094CC;
    }

    .switchLabel {
        color: ${DEFAULT_BLACK};
        margin-left: -5px;
        font-family: Roboto;
        font-size: 13px;
        line-height: 15px;
        display: flex;
        align-items: center;
    }

    .switchIcon {
        width: 18px;
        height: 18px;
        margin-left: 10px;
        color: #62727B;
    }
`
type PersonDataProps = Partial<UserVO>

const helperText = (
    <span>
        Пользователю будет разрешено авторизоваться как на центральном сервере, <br/>
        так и на буровых. При входе в систему пользователь установит свой пароль
    </span>
)

const PersonDataSection = formPure(USER, [
    'login', 'isMasterUser',
    'firstName', 'lastName', 'patrName',
    'email', 'phone', 'position', 'organization', 'password',
])
    .ap(props => {
            return (
                <StyledPersonData>
                    <HBox>
                        <FormSection style={{flex: '0 0 60%'}} label='Персональные данные' icon={Library.PersonCopy}>
                            <HBox>
                                <div className='personalAvatar'>
                                    <Library.Photo style={{opacity: 0.5}}/>
                                </div>
                                <div className='personalName'>
                                    <TextInput label='Фамилия' {...bindInput('lastName')(props)}/>
                                    <TextInput label='Имя' {...bindInput('firstName')(props)}/>
                                    <TextInput label='Отчество' {...bindInput('patrName')(props)}/>
                                </div>
                            </HBox>
                        </FormSection>
                        <FormSection style={{flex: '0 0 40%'}} label='Данные для входа' icon={Library.Googblue}>

                            <TextInput label='Логин' {...bindInput('login')(props)}/>
                            <TextInput label='Пароль' value={'*'.repeat(8)}/>
                            <Tooltip title={helperText}>
                                <div className='itemContainer authorize'>
                                    <Switch
                                        label={
                                            <div className='switchLabel'>
                                                Авторизация на сервере
                                                <Library.Help className='switchIcon'/>
                                            </div>
                                        }
                                        disabledClassName='authorization'
                                        defaultChecked={props.model.isMasterUser}
                                    />
                                </div>
                            </Tooltip>

                        </FormSection>
                    </HBox>
                    <HBox>
                        <FormSection label='Рабочие данные' icon={Library.Work} style={{flex: '0 0 60%'}}>
                            <TextInput label='Организация' {...bindInput('organization')(props)}/>
                            <TextInput label='Должность' {...bindInput('position')(props)}/>
                        </FormSection>
                        <FormSection label='Контактные данныее' icon={Library.Phone} style={{flex: '0 0 40%'}}>
                            <TextInput label='Email' {...bindInput('email')(props)}/>
                            <TextInput label='Телефон' {...bindInput('phone')(props)}/>
                        </FormSection>
                    </HBox>
                </StyledPersonData>
            )
        }
    )

export default PersonDataSection
