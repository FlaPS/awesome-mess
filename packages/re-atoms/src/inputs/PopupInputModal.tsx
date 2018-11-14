import * as React from 'react'
import {restyle} from '../styles/restyle'
import Div from '../layout/Div'
import {ButtonsRow, DialogBox, Empty, Label} from '../layout/ModalListDialog'
import TextInput from './TextInput'
import Button from '../controls/Button'
import colors from '../styles/colors'

type ModalInputProps = {
    value: string,
    title: string,
    label: string,
    type: 'name' | 'description',
    onSave: (value: string) => any,
    onCancel: () => any
    limit?: number
}

type ModalInputState = {
    value: string,
    error: boolean
    errorText: string
}

const ModalBox = restyle`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    background-color: ${colors.SOFT_BLACK};
`(Div)

class ModalInput extends React.Component <ModalInputProps, ModalInputState> {
    onChange = value => {
        const errorText =
            !this.validateEmpty(value) && 'Поле не должно быть пустым' ||
            !this.validateLength(value) && `Длина описания не должна превышать ${this.props.limit} символов` ||
            ''
        this.setState(
            {
                value,
                error: !(this.validateEmpty(value) && this.validateLength(value)),
                errorText,
            }
        )
    }
    validateEmpty = (value: string) => this.props.type !== 'name' || value.length > 0
    validateLength = (value: string) => !this.props.limit || value.length <= this.props.limit

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            error: false,
            errorText: '',
        }
    }

    render() {
        return (
            <ModalBox>
                <DialogBox>
                    <Label>
                        {this.props.title}
                    </Label>
                    <TextInput
                        onChange={this.onChange}
                        error={this.state.error}
                        label={this.state.error ? this.state.errorText : this.props.label}
                        style={{height: 70}}
                        value={this.state.value}
                    />
                    <ButtonsRow>
                        <Button
                            color='inherit'
                            disabled={this.state.error}
                            onClick={() => this.props.onSave(this.state.value)}
                        >
                            Сохранить
                        </Button>
                        <Empty/>
                        <Button color='inherit' onClick={this.props.onCancel}>Отмена</Button>
                    </ButtonsRow>
                </DialogBox>
            </ModalBox>
        )
    }
}

export default ModalInput
