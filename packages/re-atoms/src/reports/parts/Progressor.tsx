import * as React from 'react'
import {Font, restyle} from '../../styles'
import Div from '../../layout/Div'
import colors from '../../styles/colors'
import caseRender from '../../smart/caseRender'

export type ProgressorProps = {
    collapsed?: boolean
    label?: string
    color?: string
    size?: number
    value: string | number
}

const ProgressorLabel = Font.caption(restyle`margin-bottom: 12px;`)(Div)

const CollapsedProgressorLabel = Font.caption(restyle`margin-bottom: 8px;`)(Div)

const PieProgressorContainer = restyle`
    display: flex;
    flex-direction: column;
    align-items: center;
`(Div)

const ProgressBar = restyle`
    width: ${props => props.value ? props.value * 100 : 0}%;
    height: 100%;
    background-color: ${props => props.color ? props.color : colors.REPORT_GREEN};
`(Div)

const ProgressBarContainer = restyle`
    width: 100%;
    background-color: ${colors.WHITE};
    height: 8px;
    overflow: hidden;
    border-radius: 4px;
`(Div)

const NormalProgressor = (props: ProgressorProps) =>
    <div>
        {
            props.label &&
            <ProgressorLabel>
                {props.label}
            </ProgressorLabel>
        }
        <ProgressBarContainer>
            <ProgressBar color={props.color} value={props.value}/>
        </ProgressBarContainer>
    </div>

const CollapsedProgressor = (props: ProgressorProps) =>
    <PieProgressorContainer>
        <CollapsedProgressorLabel>
            {`${props.value * 100} %`}
        </CollapsedProgressorLabel>
        <svg
            viewBox={`0 0 ${props.size || 32} ${props.size || 32}`}
            width={props.size || 32}
            height={props.size || 32}
            fill={colors.HEAVY_LIGHT_LIGHT_GRAY}
            style={{borderRadius: '50%', transform: 'rotate(-90deg)', color: props.color || colors.REPORT_GREEN}}
        >
            <circle
                r={`${props.size ? props.size / 2 : 16}`}
                cx={`${props.size ? props.size / 2 : 16}`}
                cy={`${props.size ? props.size / 2 : 16}`}
                fill={colors.HEAVY_LIGHT_LIGHT_GRAY}
                stroke='currentColor'
                strokeWidth={32}
                strokeDasharray={`${props.value * 100} 158`}
            />
        </svg>
    </PieProgressorContainer>

export default caseRender(NormalProgressor)
    .match(({collapsed}) => collapsed, CollapsedProgressor)
