import * as React from 'react'
import {colors, CSS, Font, Library, restyle} from '../styles'
import {Div, Span} from '../layout'
import ModalInput from './PopupInputModal'
import contextedInput from './contextedInput'

export type PopupInputProps = {
    value?: string
    title?: string
    label?: string
    onChange?: (value: string) => any
    disabled?: boolean
    readonly?: boolean
    type?: 'name' | 'description'
}

const PseudoButton = restyle`
    transition: ${CSS.defaultTransition('color')};
    &:hover,
    &:hover > * {
        color: ${colors.DEFAULT_BLACK} !important;
        text-decoration: underline;
        cursor: pointer;
    }
`(Span)

const Name = Font.headLine(restyle`
    margin-right: 27px;
`)(Div)

const EditButton = Font.caption2(restyle`
    margin-bottom: 5px;
`)(PseudoButton)

const Description = Font.caption2(restyle`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
`)(PseudoButton)

const PopupInputContainer = restyle`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`(Div)

const RightAligned = restyle`
    text-align: right;
`(Span)

const CommentIcon = restyle`
    margin-left: 10px;
    width: 16px !important;
    height: 16px !important;
    color: ${colors.DISABLED_GRAY} !important;
    transition: ${CSS.defaultTransition('color')} !important;
`(Library.Message)

class PopUpInput extends React.Component <PopupInputProps, any> {

    renderModal = () =>
        this.state.modalShown &&
        <ModalInput
            value={this.state.value}
            title={this.props.title}
            label={this.props.label}
            type={this.props.type === 'name' ? 'name' : 'description'}
            limit={this.props.type === 'description' && 170}
            onSave={this.onSave}
            onCancel={this.toggleModal(false)}
        />
    renderName = () =>
        <PopupInputContainer>
            <Name>{this.props.value}</Name>
            {
                !this.props.readonly &&
                <EditButton onClick={this.toggleModal(true)}>Ред.</EditButton>
            }
        </PopupInputContainer>
    renderDescription = () =>
        <Description onClick={this.toggleModal(true)}>
            <RightAligned>
                {this.state.value}
            </RightAligned>
            <CommentIcon/>
        </Description>
    onSave = (value: string) => {
        this.setState({value, modalShown: false})
        this.props.onChange(value)
    }
    toggleModal = modalShown => () => this.setState({modalShown})

    constructor(props: PopupInputProps) {
        super(props)
        this.state = {
            modalShown: false,
            value: this.props.value,
        }
    }

    render() {
        return (
            <div>
                {this.props.type === 'name' ? this.renderName() : this.renderDescription()}
                {this.renderModal()}
            </div>
        )
    }
}

export default contextedInput(PopUpInput)
