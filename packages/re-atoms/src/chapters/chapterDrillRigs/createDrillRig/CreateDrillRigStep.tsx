import * as React from 'react'
import Card from '../../../Card'
import {restyle} from '../../../styles/restyle'
import TextInput from '../../../inputs/TextInput'
import {HBox, VBox} from '../../../layout/Box'
import {bindInput} from '../../../smart/form/bindInput'

import {Avatar} from '../../../layout/Avatar'
import {formPure} from '../../../smart/Form'

import {DRILL_RIG, DrillRigVO} from '@local/biz'

import RefInput from '../../../inputs/RefInput'
import {DumbSelect} from '../../../inputs/Select'
import {FormSection} from '../../../layout/FormSection'
import {getYearsFromSomeToCurrent} from '@local/utils'
import {DrillingCementComplexRadioGroup} from '../chapterDrillRigs'


const Pane = restyle`
    width: 828px;
    padding: 0px;
`(Card)

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
        .connect(
            ({biz: {drillRigOwner, drillRigType}}) =>
                ({drillRigOwner, drillRigType})
        )

const productionYears: number[] =
    getYearsFromSomeToCurrent()

const CapacityBox = restyle`
    justify-content: center;
    flex: 0 0 120px;
`(VBox)

export default Form.of(props =>
    <Pane style={{maxWidth: 700}}>

        <FormSection label='Основные данные' stretch>
            <HBox gap={24}>
                <Avatar width={150} height={200}/>
                <VBox stretch gap={10}>

                    <TextInput label='Название буровой установки' {...bindInput('name')<DrillRigVO>(props)} />

                    <RefInput label='Тип буровой установки' {...bindInput('typeId')<DrillRigVO>(props)} />

                    <RefInput label='Владелец буровой установки' {...bindInput('ownerId')<DrillRigVO>(props)} />
                </VBox>

                <CapacityBox>
                    <TextInput type='number' label='Грузопод... т' {...bindInput('capacity')<DrillRigVO>(props)} />
                </CapacityBox>
            </HBox>
        </FormSection>

        <FormSection label='Производитель'>
            <HBox gap={24}>
                <VBox gap={20} style={{flex: '0 0 320px'}}>
                    <TextInput label='Производитель' {...bindInput('manufacturer')<DrillRigVO>(props)} />
                    <TextInput label='Серийный номер' {...bindInput('serialNumber')<DrillRigVO>(props)} />
                </VBox>

                <VBox style={{flex: '0 0 136px'}}>
                    <DumbSelect
                        {...bindInput('productionYear')<DrillRigVO>(props)}
                        label='Год выпуска'
                        data={productionYears}
                    />
                </VBox>
            </HBox>
        </FormSection>

        <FormSection label='Агрегаты'>
            <HBox gap={30}>
                <div style={{flex: '0 0 320px'}}>
                    <RefInput
                        label='Тип буровой лебедки'
                        {...bindInput('rigWinchTypeId')<DrillRigVO>(props)}
                    />
                </div>

                <DrillingCementComplexRadioGroup {...props} />
            </HBox>
        </FormSection>

    </Pane>
)
