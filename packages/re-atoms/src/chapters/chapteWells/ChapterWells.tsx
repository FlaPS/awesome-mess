import * as React from 'react'
import nav from '../../app/nav'
import {Spans, TabbedPage} from '../../layout'
import {RadioGroup} from '../../inputs'
import * as moment from 'moment'

export const WellBasingRadioGroup = props =>
    <RadioGroup
        label='Тип дислокации *'
        options={[
            {value: '1', label: 'Морская'},
            {value: '0', label: 'Наземная'},
        ]}
        {...props}
    />

export const expirationTime = ({wellLicenseArea, model: {wellLicenseAreaId}}) =>
    wellLicenseAreaId
        ? moment(wellLicenseArea[wellLicenseAreaId].expirationDate).format('DD.MM.YYYY')
        : 'ДД.ММ.ГГГ'

export const renderExpirationTime = ({wellLicenseArea, model}) => {
    const time = expirationTime({wellLicenseArea, model})

    return (
        <p style={{textAlign: 'right'}}>
            <Spans.Caption>Окончание лицензии: {time}</Spans.Caption>
        </p>
    )
}

const tabs = () => [
    nav.app.chapterWells.wells.index,
    nav.app.chapterWells.projects.index,
]

export default TabbedPage(tabs)
