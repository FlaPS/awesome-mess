import * as React from 'react'
import Card from '../../../Card'
import {restyle} from '../../../styles/restyle'
import Div from '../../../layout/Div'
import TextInput from '../../../inputs/TextInput'
import {HBox, VBox} from '../../../layout/Box'
import {bindInput} from '../../../smart/form/bindInput'

import {FormSection} from '../../../layout/FormSection'
import {Avatar} from '../../../layout/Avatar'
import {formPure} from '../../../smart/Form'
import {USER} from '@local/biz'
import Library from '../../../styles/SVGLibrary'


const Pane = restyle`
    width: 828px;
    padding: 0px;
`(Card)

const Caption = restyle`
	color: rgba(0,0,0,0.87);
	font-family: Roboto;
	font-size: 15px !important;
	line-height: 24px;
`(Div)


const Form = formPure(USER, ['firstName', 'lastName', 'email'])

export default Form.ap(props =>
    <Pane>
        <VBox stretch style={{paddingBottom: 16}}>
            <FormSection label='Персональные данные' stretch icon={Library.PersonCopy}>
                <HBox gap={24}>
                    <Avatar width={192} height={208}/>
                    <VBox gap={22} width={480}>
                        <TextInput {...bindInput('lastName')(props)} label='Фамилия'/>
                        <TextInput {...bindInput('firstName')(props)} label='Имя'/>
                        <TextInput {...bindInput('patrName')(props)} label='Отчество'/>
                    </VBox>
                </HBox>
            </FormSection>

            <HBox stretch>
                <FormSection width={414} label='Рабочие данные' icon={Library.Work}>
                    <VBox gap={16}>
                        <TextInput {...bindInput('organization')(props)} label='Организация'/>
                        <TextInput {...bindInput('position')(props)} label='Должность'/>
                    </VBox>
                </FormSection>
                <FormSection width={414} label='Контактные данные' icon={Library.Phone}>
                    <VBox gap={16}>
                        <TextInput {...bindInput('email')(props)} label='Email'/>
                        <TextInput {...bindInput('phone')(props)} label='Телефон'/>
                    </VBox>
                </FormSection>
            </HBox>
        </VBox>
    </Pane>
)
