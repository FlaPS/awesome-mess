import * as React from 'react'
import {goBack, replace} from 'react-router-redux'

import nav from '../../../app/nav'
import {actions, DRILL_RIG, DrillRigVO} from '@local/biz'
import getFrontendStore, {dispatch, ui} from '../../../store/'
import {Wizard, WizardStep} from '../../../wizard/Wizard'
import AlertDialog from '../../../controls/AlertDialog'
import CreateDrillRigStep from './CreateDrillRigStep'

const steps: WizardStep<DrillRigVO>[] = [{component: CreateDrillRigStep}]

const model: Partial<DrillRigVO> = {}

export default class extends React.Component<any, { isOpen?: boolean, drillRigId?: string }> {
    onWizardComplete = (drillRig: DrillRigVO) => {
        const {payload} = dispatch(actions.create(DRILL_RIG, drillRig))

        this.setState({
            drillRigId: payload.id,
            isOpen: true,
        })
    }
    onAlertOk = () => dispatch(replace(nav.app.chapterDrillRigs.drillRigs.index.path))

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
                            title: 'Отмена создания буровой установки',
                            text: 'Вы действительно хотите отменить создание новой буровой установки',
                            cancelText: 'Нет',
                            submitText: 'Отменить',
                        })
                    )}
                />

                <AlertDialog
                    open={this.state.isOpen}
                    title={'Буровая установка создана'}
                    text={'Буровая установка создана успешно.'}
                    okText='Готово'
                    onOk={this.onAlertOk}
                />
            </div>
        )
    }
}

