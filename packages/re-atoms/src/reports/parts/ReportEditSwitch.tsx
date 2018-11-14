import * as React from 'react'
import {Body2} from '../../styles/Typography'
import {caption} from '../../styles/font'
import DropDownMenu from '../../controls/DropdownMenu'
import {restyle} from '../../styles'
import Div from '../../layout/Div'
import colors from '../../styles/colors'
import Library from '../../styles/SVGLibrary'
import caseRender from '../../smart/caseRender'
import makeValue from '../../smart/makeValue'


export type reportEditSwitchProps = {
    value?: boolean
    onChange: (value: boolean) => any
}

const makeSmallGrayFlexIcon = Icon => restyle`
    color: ${colors.EXTRA_SOFT_BLACK};
    height: 20px;
    width: 20px;
    flex: none;
    cursor: pointer;
`(Icon)

const makeGrayFlexIcon = Icon => restyle`
    color: ${colors.EXTRA_SOFT_BLACK};
    margin-right: 8px;
    flex: none;
`(Icon)

const Caption = caption()(Div)

const FlexCaption = restyle`
    flex: auto;
`(Caption)

const EditIcon = makeGrayFlexIcon(Library.Edit)

const ViewIcon = makeGrayFlexIcon(Library.Visible)

const SmallEditIcon = makeSmallGrayFlexIcon(Library.Edit)

const SmallViewIcon = makeSmallGrayFlexIcon(Library.Visible)

const DropDownButton = restyle`
    display: flex;
    align-items: center;
    padding: 4px 6px 4px 10px;

    &:hover{
        cursor: pointer;
        background-color: ${colors.HEAVY_LIGHT_GRAY};
    }
`(Div)

type dropdownItemTextProps = {
    label: string
    subLabel: string
}

const DropDownText = (props: dropdownItemTextProps) =>
    <FlexContainer>
        <Body2>{props.label}</Body2>
        <Caption>{props.subLabel}</Caption>
    </FlexContainer>

const FlexContainer = restyle`
    display: flex;
    flex-direction: column;
`(Div)

const EditModeButton =
    <DropDownButton>
        <EditIcon/>
        <FlexCaption>Режим редактирования</FlexCaption>
        <Library.ArrowDown/>
    </DropDownButton>

const WatchModeButton =
    <DropDownButton>
        <ViewIcon/>
        <FlexCaption>Режим просмотра</FlexCaption>
        <Library.ArrowDown/>
    </DropDownButton>

const MenuButton =
    caseRender<Partial<reportEditSwitchProps>>(WatchModeButton)
        .match(({value}) => value, EditModeButton)

const getReportEditDropdownMenuData = (props: reportEditSwitchProps) => [
    {
        renderIcon: () => <SmallEditIcon/>,
        renderLabel: () => <DropDownText label='Режим редактирования' subLabel='Редактирование в реальном времени'/>,
        onChange: () => props.onChange(true),
    },
    {
        renderIcon: () => <SmallViewIcon/>,
        renderLabel: () => <DropDownText label='Режим просмотра' subLabel='Вид документа для печати'/>,
        onChange: () => props.onChange(false),
    },
]

const ReportEditSwitch = (props: reportEditSwitchProps) =>
    <DropDownMenu data={getReportEditDropdownMenuData(props)}>
        <MenuButton value={props.value}/>
    </DropDownMenu>

export default makeValue<boolean>()
    .of(ReportEditSwitch)
