import * as React from 'react'
import {Wizard, WizardStep} from '../../../wizard/Wizard'
import {dispatch, ui} from '../../../store/'
import {actions, WELL, WellVO} from '@local/biz'
import AlertDialog from '../../../controls/AlertDialog'
import {goBack, replace} from 'react-router-redux'
import nav from '../../../app/nav'
import CreateWellStep from './CreateWellStep'

const steps: WizardStep<WellVO>[] = [{component: CreateWellStep}]

const model: Partial<WellVO> = {}

export default class extends React.Component<any, { isOpen?: boolean, wellId?: string }> {
    onWizardComplete = (well: WellVO) => {
        const {payload} = dispatch(actions.create(WELL, well))

        this.setState({
            wellId: payload.id,
            isOpen: true,
        })
    }
    onAlertOk = () => dispatch(replace(nav.app.chapterWells.projects.index.path))
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
                    onExit={() => dispatch(
                        ui.actions.confirmDialog({
                            action: goBack(),
                            title: 'Отмена создания группы скважин',
                            text: 'Вы действительно хотите отменить создание новой группы скважины',
                            cancelText: 'Нет',
                            submitText: 'Отменить',
                        })
                    )}
                />

                <AlertDialog
                    open={this.state.isOpen}
                    title={'Группа создана'}
                    text={'Скважина создана успешно. Хотите добавить скважину в группу?'}
                    okText='Добавить'
                    cancelText='Позже'
                    onOk={this.onAlertOk}
                    onCancel={this.onAlertCancel}
                />
            </div>
        )
    }
}

