import * as React from 'react'
import {Renderable} from '../../smart/renderChildren'
import Library from '../../styles/SVGLibrary'
import {Font, restyle} from '../../styles'
import Div from '../../layout/Div'
import colors from '../../styles/colors'
import caseRender from '../../smart/caseRender'


export type ReportSectionLinkProps = {
    label?: string
    resolved?: boolean
    selected?: boolean
    sectionKey: string
    icon?: Renderable
    onClick: (key: string) => void
    collapsed?: boolean
    isHeader?: boolean
    open?: boolean
}

const ReportSectionLinkContainer = restyle`
    display: flex;
`(Div)

const CollapsedSectionLinkContainer = restyle`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.selected ? colors.SELECTED_REPORT_LINK_GRAY : 'inherit'};
    color:  ${props => props.selected ? colors.DEEP_BLUE : colors.SOFT_BLACK};

    &:hover {
        cursor:pointer;
        background-color: ${colors.SELECTED_REPORT_LINK_GRAY};
    }
`(Div)

const ResolvedIconDiv = restyle`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 20px;
    margin-right: 8px;
    border-radius: 50%;
    color: ${colors.WHITE};
    background-color: ${colors.REPORT_GREEN};
`(Div)

const LinkDiv = restyle`
    padding-left: 8px;
    width: 100%;

    &:hover {
        cursor: pointer;
        background-color: ${colors.SELECTED_REPORT_LINK_GRAY};
    }
`
const ReportSectionLinkDiv = caseRender(Font.body2(LinkDiv)(Div))
    .match(({isHeader}) => !isHeader, Font.body1(LinkDiv)(Div))

const ClosedIcon = restyle`
    margin-right: 4px;
`(Library.ArrowDown)

const OpenIcon = restyle`
    margin-right: 4px;
`(Library.ArrowUp)

const EmptyIcon = restyle`
    display: none;
`(Div)

const ResolvedIcon = () =>
    <ResolvedIconDiv>
        <Library.Done/>
    </ResolvedIconDiv>

const CollapsedReportSectionLink =
    (props: ReportSectionLinkProps) =>
        <CollapsedSectionLinkContainer selected={props.selected} onClick={() => props.onClick(props.sectionKey)}>
            {props.icon}
            {props.isHeader &&
            (props.open
                ? <Library.ArrowDown fill={props.selected ? colors.DEFAULT_BLACK : colors.SOFT_BLACK}/>
                : <Library.ArrowRight fill={props.selected ? colors.DEFAULT_BLACK : colors.SOFT_BLACK}/>)
            }
        </CollapsedSectionLinkContainer>


const RenderIcon = caseRender(EmptyIcon)
    .match(({isHeader, open}) => isHeader && open, OpenIcon)
    .match(({isHeader, open}) => isHeader && !open, ClosedIcon)
    .match(({resolved}) => resolved, ResolvedIcon)

const ReportSectionLink = (props: ReportSectionLinkProps) =>
    <ReportSectionLinkContainer>
        <RenderIcon resolved={props.resolved} isHeader={props.isHeader} open={props.open}/>
        <ReportSectionLinkDiv isHeader={props.isHeader} onClick={() => props.onClick(props.sectionKey)}>
            {props.label}
        </ReportSectionLinkDiv>
    </ReportSectionLinkContainer>

export default caseRender(ReportSectionLink)
    .match(({collapsed}) => collapsed, CollapsedReportSectionLink)
