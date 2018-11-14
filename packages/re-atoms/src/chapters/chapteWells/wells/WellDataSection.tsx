import * as React from 'react'
import {WELL, WELL_FIELD, WELL_LICENSE_AREA, WELL_PLACE, WELL_PURPOSE, WELL_STATUS, WellVO,} from '@local/biz'
import {formPure} from '../../../smart/Form'
import {bindInput} from '../../../smart/form/bindInput'
import {FormSection, HBox, VBox} from '../../../layout'
import {CoordinatePicker, NumberInput, RefInput, TextInput} from '../../../inputs'
import {debug} from '@local/utils'
import {expirationTime, WellBasingRadioGroup} from '../ChapterWells'
import {InputReadOnlyContainer, InputReadOnlyEmpty} from '../../../inputs/InputReadonly'

export default formPure(WELL, [
    'wellFieldId', 'wellPlaceId', 'wellPurposeId',
    'wellStatusId', 'wellLicenseAreaId', 'startDate',
    'clusterNumber', 'basing', 'number',
])
    .connect(state => ({
        wellLicenseArea: WELL_LICENSE_AREA.asMap()(state),
        wellField: WELL_FIELD.asMap()(state),
        wellPlace: WELL_PLACE.asMap()(state),
        wellPurpose: WELL_PURPOSE.asMap()(state),
        wellStatus: WELL_STATUS.asMap()(state),
    }))
    .ap(debug(props =>
        <VBox>
            <FormSection label='Основные данные'>
                <HBox gap={24}>
                    <VBox stretch>
                        <RefInput {...bindInput<WellVO>('wellFieldId')(props)} />
                        <RefInput
                            label={'Недропользователь (не имплементировано)'}
                            {...bindInput<WellVO>('wellPlaceId')(props)}
                        />
                    </VBox>
                    <VBox stretch>
                        <RefInput {...bindInput<WellVO>('wellPlaceId')(props)} />
                        <HBox gap={24} stretch>
                            <VBox stretch>
                                <TextInput label='Номер скважины' {...bindInput<WellVO>('number')(props)} />
                            </VBox>
                            <VBox stretch>
                                <TextInput label='Номер куста' {...bindInput<WellVO>('clusterNumber')(props)} />
                            </VBox>
                        </HBox>
                    </VBox>
                </HBox>
            </FormSection>

            <FormSection label='Статус и назначение'>
                <HBox gap={24}>
                    <VBox stretch>
                        <RefInput {...bindInput<WellVO>('wellPurposeId')(props)}/>
                        <WellBasingRadioGroup {...bindInput('basing')<WellVO>(props)} />
                    </VBox>
                    <VBox stretch>
                        <RefInput {...bindInput<WellVO>('wellStatusId')(props)}/>
                    </VBox>
                </HBox>
            </FormSection>

            <FormSection label='Лицензия'>
                <HBox gap={24} stretch>
                    <VBox stretch>
                        <RefInput {...bindInput('wellLicenseAreaId')(props)} />
                    </VBox>
                    <VBox stretch>
                        <InputReadOnlyContainer>
                            Окончание лицензии
                            <InputReadOnlyEmpty>
                                {expirationTime(props)}
                            </InputReadOnlyEmpty>
                        </InputReadOnlyContainer>
                    </VBox>
                </HBox>
            </FormSection>

            <FormSection gap={24} label='Координаты устья'>
                <HBox gap={24} stretch>
                    <CoordinatePicker {...bindInput<WellVO>('coordinates')(props)}/>
                </HBox>
                <HBox gap={24} width='25%'>
                    <NumberInput
                        label='Альтитуда, м'
                        {...bindInput<WellVO>('altitude')(props)}
                    />
                </HBox>
            </FormSection>
        </VBox>
    ))
