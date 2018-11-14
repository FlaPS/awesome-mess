import * as React from 'react'
import {Wizard, WizardStep} from '../../../wizard/Wizard'
// @ts-ignore
import * as randomColor from 'randomcolor'
import {dispatch} from '../../../store/index'
import {actions, ROLE, RoleVO, sel} from '@local/biz'
import StepRoleName from './StepRoleName'
import StepRightsInRole from './StepRightsInRole'
import AlertDialog from '../../../controls/AlertDialog'
import {goBack, replace} from 'react-router-redux'
import nav from '../../../app/nav'
import {ui} from '../../../store/'
import renderChildren from '../../../smart/renderChildren'
import {Spans, VBox} from '../../../layout'

const StepRightsInRoleContainer = ({children, ...props}) =>
    <VBox gap={16} width={1230}>
        <Spans.Caption2>
            Функционал роли будет возможно изменить в настройках роли
        </Spans.Caption2>
        {renderChildren(children, props)}
    </VBox>


const steps: WizardStep<RoleVO>[] = [
    {
        label: 'Новая роль',
        description: 'Название',
        component: StepRoleName,
    }, {
        label: 'Функционал',
        description: 'Функции в системе',
        component: StepRightsInRole.contramap(StepRightsInRoleContainer),
    },
]

const getRandomColor = () =>
    randomColor({
        luminosity: 'dark',
        format: 'hex',
    })


export default class extends React.Component<any, { isOpen?: boolean, roleId?: string }> {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const role = sel(ROLE).byKey(this.state.roleId)()
        const text = 'Роль ' + (role ? role.name : '') + ' создана. Хотите назначить эту роль пользователям?'
        return (
            <div>
                <Wizard
                    model={{color: getRandomColor(), rights: {}, reportRights: {}}}
                    steps={steps}
                    onExit={() => dispatch(
                        ui.actions.confirmDialog({
                            action: goBack(),
                            title: 'Отмена создания роли',
                            text: 'Вы действительно хотите отменить создание новой роли',
                            cancelText: 'Нет',
                            submitText: 'Отменить',
                        })
                    )}
                    onComplete={
                        (role: RoleVO) => {
                            const action = actions.create(ROLE, role)
                            dispatch(action)
                            this.setState({roleId: action.payload.id, isOpen: true})
                        }
                    }
                />

                <AlertDialog
                    open={this.state.isOpen}
                    okText='Назначить'
                    cancelText='Позже'
                    title='Назначение роли пользователям'
                    text={text}
                    onCancel={() => dispatch(goBack())}
                    onOk={() =>
                        dispatch(replace(nav.app.access.assignRole.index.get(this.state)))
                    }
                />
            </div>
        )
    }
}

