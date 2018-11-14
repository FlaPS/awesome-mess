import * as React from 'react'
import {colors as C, restyle} from '../../styles'
import {Label, RegularBadge, RemoveIcon} from '../../badges/elements'
import caseRender from '../../smart/caseRender'

type ReportSectionStatusButtonProps = {
    onChange: (value: boolean) => void
    value: boolean
    // когда секция рапорта в фокусе, кнопка подствечивается зелёным
    sectionActive: boolean
}

const Badge = restyle`
    display: inline-flex;
    cursor: pointer;
    border-color: transparent;
`(RegularBadge) as any as React.StatelessComponent

const getColor = sectionActive =>
    sectionActive
        ? C.REPORT_GREEN
        : C.DISABLED_GRAY

const ReportSectionStatusButton = ({sectionActive, onChange, value}: ReportSectionStatusButtonProps) =>
    <Badge color={getColor(sectionActive)} onClick={() => onChange(!value)}>
        <Label>Раздел готов</Label>
        <RemoveIcon/>
    </Badge>

export default caseRender(ReportSectionStatusButton)
    .match(({value}) => !value, null)
