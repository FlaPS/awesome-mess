import * as React from 'react'
import {Wizard, WizardStep} from '../../../wizard/Wizard'
import getFrontendStore, {dispatch, ui} from '../../../store/'
import {actions, PROJECT, ProjectVO} from '@local/biz'
import AlertDialog from '../../../controls/AlertDialog'
import {goBack, replace} from 'react-router-redux'
import nav from '../../../app/nav'
import StepWellProjectName from './StepWellProjectName'

const steps: WizardStep<ProjectVO>[] = [{component: StepWellProjectName}]

const model: Partial<ProjectVO> = {}

export default class extends React.Component<any, { isOpen?: boolean, projectId?: string }> {
    onWizardComplete = (well: ProjectVO) => {
        const {payload} = dispatch(actions.create(PROJECT, well))

        this.setState({
            projectId: payload.id,
            isOpen: true,
        })
    }
    onAlertOk = () => dispatch(replace(nav.app.chapterWells.assignProject.index.get({projectId: this.state.projectId})))
    onAlertCancel = () => dispatch(goBack())

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {

        return (
            <div>
                <Wizard
                    model={model}
                    steps={steps}
                    disableStepLine
                    onComplete={this.onWizardComplete}
                    onExit={() => getFrontendStore().dispatch(
                        ui.actions.confirmDialog({
                            action: goBack(),
                            title: 'Отмена создания группы скважины',
                            text: 'Вы действительно хотите отменить создание новой группы скважин',
                            cancelText: 'Нет',
                            submitText: 'Отменить',
                        })
                    )}
                />
                <AlertDialog
                    open={this.state.isOpen}
                    title={'Группа создана'}
                    text={'Вы хотите добавить скважины в новую группу?'}
                    okText='Добавить'
                    cancelText='Позже'
                    onOk={this.onAlertOk}
                    onCancel={this.onAlertCancel}
                />
            </div>
        )
    }
}

