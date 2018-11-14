import * as React from 'react'
import Card from '../../../Card'
import {restyle} from '../../../styles/restyle'
import TextInput from '../../../inputs/TextInput'
import {HBox, VBox} from '../../../layout/Box'
import {bindInput} from '../../../smart/form/bindInput'
import {Avatar} from '../../../layout/Avatar'
import {formPure} from '../../../smart/Form'

import {WELL, WellVO} from '@local/biz'
import RefInput from '../../../inputs/RefInput'
import {debug} from '@local/utils'
import CoordinatePicker from '../../../inputs/CoordinatePicker'
import {WellBasingRadioGroup} from '../ChapterWells'


const Pane = restyle`
    width: 828px;
    padding: 0px;
`(Card)

const Form = formPure(WELL, [
    'basing',
    'startDate',
    'wellLicenseAreaId',
    'wellFieldId',
    'wellPlaceId',
    'wellPurposeId',
    'wellStatusId',
    'number',
    'coordinates',
])
    .connect(
        ({biz: {wellLicenseArea, wellField, wellPlace, wellPurpose, wellStatus}}) =>
            ({wellLicenseArea, wellField, wellPlace, wellPurpose, wellStatus})
    )

export default Form.ap(debug(props =>
    <Pane>
        <VBox gap={20} style={{padding: '32px 24px 28px'}}>
            <HBox gap={24}>
                <Avatar width={240} height={140}/>
                <VBox stretch gap={10}>

                    <RefInput
                        label={'Лицензионный участок'}
                        {...bindInput<WellVO>('wellLicenseAreaId')(props)}
                    />

                    <WellBasingRadioGroup {...bindInput('basing')<WellVO>(props)} />

                </VBox>
            </HBox>

            <HBox gap={24}>
                <RefInput
                    label={'Месторождение'}
                    {...bindInput<WellVO>('wellFieldId')({
                        helperText: 'Заполните поле Месторождение или Площадь',
                        ...props,
                    })}
                />
                <RefInput
                    label={'Площадь'}
                    {...bindInput<WellVO>('wellPlaceId')({
                        helperText: 'Заполните поле Месторождение или Площадь',
                        ...props,
                    })}
                />
            </HBox>

            <HBox gap={24}>

                <RefInput
                    label={'Недропользователь (не имплементировано)'}
                    {...bindInput<WellVO>('wellPlaceId')(props)}
                />

                <HBox stretch gap={25}>
                    <TextInput label='Номер скважины' {...bindInput<WellVO>('number')(props)} />
                    <TextInput label='Номер куста' {...bindInput<WellVO>('clusterNumber')(props)} />
                </HBox>
            </HBox>

            <HBox gap={24}>
                <RefInput
                    label={'Назначение'}
                    {...bindInput<WellVO>('wellPurposeId')(props)}
                />
                <RefInput
                    label={'Текущий статус'}
                    {...bindInput<WellVO>('wellStatusId')(props)}
                />
            </HBox>

            <VBox gap={24}>
                <HBox gap={24}>
                    <CoordinatePicker {...bindInput('coordinates')(props)} />
                </HBox>
                <HBox gap={24} width='25%'>
                    <TextInput label='Альтитуда, м' {...bindInput<WellVO>('altitude')(props)}/>
                </HBox>
            </VBox>
        </VBox>
    </Pane>
))
