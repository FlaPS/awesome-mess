import * as React from 'react'
import {default as Div, DivProps} from '../layout/Div'

import {addIndex, map, omit} from 'ramda'
import styled from 'styled-components'
import {colors, Library} from '../styles'
import {mapProps} from 'recompose'

const omitStepLineProps = omit(['currentStep', 'steps'])

export type StepInfo = DivProps & {
    description?: string
    label?: string
    index?: number
    passed?: boolean
    current?: boolean
}

export type StepLineProps = DivProps & {
    currentStep: number
    steps: StepInfo[]
}

const StepDivider: React.SFC<StepInfo> = styled<StepInfo>(Div)`
    position: relative;
    display: flex;
    margin-right: 60px;

    &:not(:last-child):after {
        position: absolute;
        top: 18px;
        right: -59px;
        height: 1px;
        width: 51px;
        opacity: 0.38;
        background-color: #BDBDBD;
        content: '';
    }
` as any

const StepLabel: React.SFC<StepInfo> = styled<StepInfo>(Div)`
    height: 16px;
    color: ${props => props.passed || props.current ? colors.DEFAULT_BLACK : colors.SOFT_BLACK};
    white-space: nowrap;
    overflow: hidden;
    max-width: calc(25% - 94px);
    text-overflow: ellipsis;
    font-family: Roboto;
    font-size: 14px;
    font-weight: ${({current}) => current ? 500 : 400};
    line-height: 16px;
` as any

const StepSubLabel: React.SFC<StepInfo> = styled<StepInfo>(Div)`
    height: 14px;
    color: ${colors.SOFT_BLACK};
    font-family: Roboto;
    font-size: 12px;
    line-height: 14px;
` as any


const StepIcon: React.SFC<StepInfo> = styled<StepInfo>(Div)`
    margin: 4px 7px 3px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height:24px;
    border-radius:50%;
    color: ${colors.WHITE};
    font-family: Roboto;
    font-size: 12px;
    font-weight: 500;
    height: 24px;
    width: 24px;
    background-color: ${props => props.passed || props.current ? colors.PRIMARY : colors.EXTRA_SOFT_BLACK};
` as any

const stepLabel = props =>
    props.label && (
        <StepLabel
            title={props.label}
            passed={props.passed}
            current={props.current}
        >
            {props.label}
        </StepLabel>
    )

const Step = (props: StepInfo) => (
    <StepDivider>
        <StepIcon
            current={props.current}
            passed={props.passed}
        >
            {props.passed ? <Library.Done/> : props.index + 1}
        </StepIcon>
        <div>
            {stepLabel(props)}
            {props.description && <StepSubLabel>{props.description}</StepSubLabel>}
        </div>
    </StepDivider>
)

const createStep = (currentIndex: number) => (step: StepInfo, index: number) => (
    <Step
        label={step.label}
        key={'step' + index}
        description={step.description}
        current={index === currentIndex}
        index={index}
        passed={currentIndex > index}
    />
)


/**
 * Represent all steps with title, labels and current active
 * @param {StepLineProps} props
 * @constructor
 */
const StepLine = (props: StepLineProps) => (
    <div {...omitStepLineProps(props)}>
        {addIndex(map)(createStep(props.currentStep))(props.steps)}
    </div>
)


export default styled(StepLine)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72px;
    width: 100%;
    background-color: ${colors.WHITE};
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`
