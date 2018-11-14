import * as React from 'react'
import {defaultProps} from 'recompose'
import Button from '../controls/Button'
import {DivProps} from '../layout/Div'
import {HBox, VBox} from '../layout/Box'
import StepLine from './StepLine'
import {mergeDeepRight} from 'ramda'
import getStore from '../store/'
import {goBack} from 'react-router-redux'
import {Scheme} from '@local/biz'
import {withStyles} from 'material-ui/styles'
import {SOFT_BLACK} from '../styles/colors'
import PageDiv from '../layout/PageDiv'

const buttonStyles = {color: SOFT_BLACK, flex: 'none'}

const PrevButton = defaultProps({children: 'ВЕРНУТЬСЯ', onClick: null})(Button)
const StyledPrevButton = withStyles({
    root: {
        ...buttonStyles,
        marginLeft: -16,
    }
})(PrevButton)

const CancelButton = defaultProps({children: 'ОТМЕНА', onClick: null})(Button)
const StyledCancelButton = withStyles({
    root: buttonStyles,
})(CancelButton)

const NextButton = defaultProps({children: 'ДАЛЕЕ', primary: true, disabled: false, onClick: null})(Button)

type WizardFooterProps = DivProps & {
    nextDisabled?: boolean
    isFirstStep?: boolean
    isLastStep?: boolean
    lastStepLabel?: string


    onNext?: Function
    onPrev?: Function
    onCancel?: Function
}

export const WizardFooter = (props: WizardFooterProps) => (
    <HBox style={{width: '100%', paddingTop: '24px'}} gap={8}>
        {
            !props.isFirstStep &&
            <StyledPrevButton onClick={props.onPrev}/>
        }
        <HBox stretch/>
        <StyledCancelButton onClick={props.onCancel}/>
        <NextButton
            onClick={props.onNext}
            disabled={props.nextDisabled}
        >
            {
                props.isLastStep
                    ? (props.lastStepLabel || 'СОЗДАТЬ')
                    : 'ДАЛЕЕ'
            }
        </NextButton>
    </HBox>
)


type WizardStepView<T> = React.ComponentType<{
    onValid: (value: Partial<T>) => any
    onInvalid?: (value: Partial<T>) => any
    model: Partial<T>
    onlyTouchedErrors?: boolean
    scheme: Scheme<T>
}> & { defaultProps: any }

export type WizardStep<T> = {
    component: Partial<WizardStepView<T>>
    description?: string
    label?: string
}

export type WizardProps<T = {}> = {
    steps?: Array<WizardStep<T>>
    model?: Partial<T>
    disableStepLine?: boolean
    onComplete?: (model: Partial<T>) => any
    onExit?: () => any
    scheme?: Scheme<T>
}

type WizardState<T = {}> = {
    model: Partial<T>
    currentStep: number
    isNextDisabled: boolean
}


export const WizardView = props => <div/>


export class Wizard<T = any> extends React.Component<WizardProps<T>, WizardState<T>> {

    static defaultProps = {
        onExit: () => getStore().dispatch(goBack()),
    }
    private onCancel = () =>
        this.props.onExit()
    private onNext = () =>
        this.state.currentStep === this.props.steps.length - 1
            ? this.props.onComplete(this.state.model)
            : this.setState({currentStep: this.state.currentStep + 1})
    private onValid = (model: T) =>
        this.setState({
            model: mergeDeepRight(this.state.model, model),
            isNextDisabled: false,
        })
    private onInvalid = (model: T) => {
        this.setState({
            isNextDisabled: true,
            model: mergeDeepRight(this.state.model, model),
        })
    }
    private renderStepLine = () =>
        !this.props.disableStepLine && <StepLine currentStep={this.state.currentStep} steps={this.props.steps}/>

    constructor(props) {
        super(props)

        this.state = {
            model: props.model || {},
            currentStep: 0,
            isNextDisabled: false,
        }
    }

    render() {
        const View = this.props.steps[this.state.currentStep].component

        return (
            <PageDiv>
                <VBox>
                    {this.renderStepLine()}
                    <div style={{margin: 'auto', paddingTop: '24px'}}>
                        <View
                            model={this.state.model}
                            onValid={this.onValid}
                            onInvalid={this.onInvalid}
                            onlyTouchedErrors
                        />
                        <WizardFooter
                            onCancel={this.onCancel}
                            onNext={this.onNext}
                            onPrev={() => this.setState({currentStep: this.state.currentStep - 1})}
                            nextDisabled={this.state.isNextDisabled}
                            isLastStep={this.state.currentStep === this.props.steps.length - 1}
                            isFirstStep={this.state.currentStep === 0}
                        />
                    </div>
                </VBox>
            </PageDiv>
        )
    }
}


