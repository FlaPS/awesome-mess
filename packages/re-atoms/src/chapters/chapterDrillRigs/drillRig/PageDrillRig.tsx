import * as React from 'react'

import {FrontState} from '../../../store/index'
import {connect} from 'react-redux'
import {actions, DRILL_RIG, DRILL_RIG_OWNER, DRILL_RIG_TYPE, DrillRigVO} from '@local/biz'

import PageLayout from '../../../layout/PageLayout'
import {dispatch} from '../../../store/'
import DialogEditFormUC from '../../../smart/form/DialogEditFormUC'
import {HBox, VBox} from '../../../layout/Box'
import {FormSection} from '../../../layout/FormSection'
import {TextInput} from '../../../inputs/index'
import {bindInput} from '../../../smart/form/bindInput'
import {Avatar} from '../../../layout/Avatar'
import RefInput from '../../../inputs/RefInput'
import {formPure} from '../../../smart/Form'
import {getYearsFromSomeToCurrent} from '@local/utils'
import {DumbSelect} from '../../../inputs/Select'
import {DrillingCementComplexRadioGroup} from '../chapterDrillRigs'
import {restyle} from '../../../styles/restyle'


const Form =
    formPure(DRILL_RIG, [
        'name',
        'serialNumber',
        'capacity',
        'manufacturer',
        'productionYear',
        'ownerId',
        'typeId',
        'drillingCementComplex',
        'rigWinchTypeId',
    ])
        .connect(state => ({
            drillRigOwner: DRILL_RIG_OWNER.asMap()(state),
            drillRigType: DRILL_RIG_TYPE.asMap()(state),
        }))

const FirstHBox = restyle`
    flex: 0 0 350px;
`(HBox)

const FirstVBox = restyle`
    flex: 0 0 350px;
`(VBox)

const DrillRigSection = Form.of(props => (
    <div style={{width: '720px'}}>
        <FormSection label='Основные данные' stretch>
            <HBox gap={24}>
                <FirstHBox gap={21}>
                    <Avatar width={90} height={120}/>

                    <VBox stretch gap={24}>
                        <TextInput label='Название буровой установки' {...bindInput('name')(props)} />
                        <RefInput label='Тип буровой установки' {...bindInput('typeId')(props)} />
                    </VBox>
                </FirstHBox>

                <VBox stretch gap={24}>
                    <TextInput type='number' label='Грузопод... т' {...bindInput('capacity')(props)} />
                    <RefInput label='Владелец буровой установки' {...bindInput('ownerId')(props)} />
                </VBox>
            </HBox>
        </FormSection>
        <FormSection label='Производитель' stretch>
            <HBox gap={24}>
                <FirstVBox width={330} gap={24}>
                    <TextInput label='Производитель' {...bindInput('manufacturer')(props)} />
                    <TextInput label='Серийный номер' {...bindInput('serialNumber')(props)} />
                </FirstVBox>
                <VBox style={{flex: 'auto'}} gap={24}>
                    <DumbSelect
                        {...bindInput('productionYear')<DrillRigVO>(props)}
                        label='Год выпуска'
                        data={getYearsFromSomeToCurrent()}
                    />
                </VBox>
            </HBox>
        </FormSection>
        <FormSection label='Агрегаты' stretch>
            <HBox gap={24}>
                <FirstVBox style={{flex: '0 0 320px'}}>
                    <RefInput
                        label='Тип буровой лебедки'
                        {...bindInput('rigWinchTypeId')<DrillRigVO>(props)}
                    />
                </FirstVBox>

                <DrillingCementComplexRadioGroup {...props} />
            </HBox>
        </FormSection>
    </div>
))

const StatusSection = props =>
    <FormSection label='Текущий статус' stretch/>


const DrillRigProfile = connect(
    (state: FrontState, props: { drillRigId: string }): { drillRig: DrillRigVO } => ({
        drillRig: DRILL_RIG.byKey(props.drillRigId)(state),
    })
)(props => (
    <PageLayout>
        <VBox marginAuto gap={24}>
            <DialogEditFormUC
                stretch
                model={props.drillRig}
                viewer={DrillRigSection}
                onEdit={drillRig =>
                    dispatch(actions.update(DRILL_RIG, drillRig))
                }
            />

            <DialogEditFormUC
                stretch
                model={props.drillRig}
                viewer={StatusSection}
                onEdit={drillRig =>
                    dispatch(actions.update(DRILL_RIG, drillRig))
                }
            />
        </VBox>
    </PageLayout>
))

export default DrillRigProfile