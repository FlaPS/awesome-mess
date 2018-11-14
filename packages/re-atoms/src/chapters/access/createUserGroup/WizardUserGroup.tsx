import getFrontendStore from '../../../store/'
import getStore, {ui} from '../../../store/'
import * as React from 'react';
import {Wizard, WizardStep} from '../../../wizard/Wizard'
import {actions, GROUP, GroupVO} from '@local/biz'
import {goBack, replace} from 'react-router-redux'

import StepUserGroupName from './StepUserGroupName'
import StepUserGroupWells from './StepUserGroupWells'
import nav from '../../../app/nav'
import AlertDialog from '../../../controls/AlertDialog'

const steps: WizardStep<GroupVO>[] = [
    {
        label: 'Название группы',
        description: 'Название',
        component: StepUserGroupName,
    },
    {
        label: 'Права доступа',
        description: 'Доступные скважины',
        component: StepUserGroupWells,
    },

]
export default class extends React.Component<any, { isOpen?: boolean, groupId?: string }> {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const userGroup = getFrontendStore().getState().biz.groupId[this.state.groupId]
        const text = `Группа ${userGroup ? userGroup.name : ''} создана. Хотите назначить эту группу пользователям?`

        return (
            <div>
                <Wizard
                    steps={steps}
                    model={{wellIds: [], projectIds: [], excludedWellsInProjects: {}}}

                    onExit={() => getFrontendStore().dispatch(
                        ui.actions.confirmDialog({
                            action: goBack(),
                            title: 'Отмена создания группы пользователей',
                            text: 'Вы действительно хотите отменить создание новой группы пользователей',
                            cancelText: 'Нет',
                            submitText: 'Отменить',
                        })
                    )}

                    onComplete={
                        (group: GroupVO) => {
                            const action = actions.create(GROUP, group)
                            getStore().dispatch(action)
                            this.setState({groupId: action.payload.id, isOpen: true})
                        }
                    }
                />

                <AlertDialog
                    open={this.state.isOpen}
                    okText='Назначить'
                    cancelText='Позже'
                    title='Назначение группы пользователям'
                    text={text}
                    onCancel={() => getStore().dispatch(goBack())}
                    onOk={() =>
                        getStore().dispatch(replace(nav.app.access.assignUserGroup.index.get(this.state)))
                    }
                />
            </div>
        )
    }
}
