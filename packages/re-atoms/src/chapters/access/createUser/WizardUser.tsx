import * as React from 'react'
import {Wizard, WizardStep} from '../../../wizard/Wizard'
import {actions, USER, UserVO} from '@local/biz'
import CreateLoginStep from './CreateLoginStep'
import PersonalDataStep from './CreatePersonalDataStep'
import {Pure} from '../../../smart/Pure'
import getStore, {ui} from '../../../store/'
import AddRolesStep from './AddRolesStep'
import {goBack} from 'react-router-redux'

const steps: WizardStep<UserVO>[] = [
    {
        label: 'Данные авторизации',
        description: 'Логин и Пароль',
        component: CreateLoginStep,
    },
    {
        label: 'Персональные данные',
        description: 'Данные пользователя',
        component: PersonalDataStep,
    },
    {
        label: 'Доступный функционал',
        description: 'Назначение ролей',
        component: AddRolesStep,
    },
]


export default Pure()
    .ap(props =>
        <Wizard
            steps={steps}
            onExit={() => props.dispatch(
                ui.actions.confirmDialog({
                    action: goBack(),
                    title: 'Отмена создания пользователя',
                    text: 'Вы действительно хотите отменить создание нового пользователя',
                    cancelText: 'Нет',
                    submitText: 'Отменить',
                })
            )}
            onComplete={
                (user: UserVO) => {
                    getStore().dispatch(actions.create(USER, user))
                    getStore().dispatch(goBack())
                }
            }
        />
    )
