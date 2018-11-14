import * as React from 'react'
import TextField from 'material-ui/TextField'
import caseRender from '../smart/caseRender'
import TextFieldReadOnly from './InputReadonly'
import contextedInput from './contextedInput'
import {TextInputProps} from './TextInput'

type NumberInputProps =
    & TextInputProps
    & {
    minValue?: number
    maxValue?: number
}

export class NumberInput extends React.Component<NumberInputProps, any> {
    onChange = e => {
        let value = e.target.value.replace(',', '.')
        value = value[0] === '-' ? `-${value.replace(/[^0-9$.]/g, '')}` : value.replace(/[^0-9$.]/g, '')
        if (value.split('.')[0].length === 0 || value.split('.')[0] === '-')
            value = `${value.split('.')[0]}${value.split('.').slice(1).join('')}`

        if (value.split('.').length > 2) {
            const integerPart = value.split('.')[0]
            const fractPart = value.split('.').slice(1).join('')
            value = `${integerPart}.${fractPart}`
        }

        this.setState({value}, () => this.props.onChange(this.state.value))
    }
    onBlur = () => this.setState({value: isNaN(parseFloat(this.state.value)) ? '' : parseFloat(this.state.value)},
        () => this.props.onChange(this.state.value))
    getHelperText = () => {
        if (this.isInvalid()) {
            if (this.props.minValue && this.props.maxValue)
                return `${this.props.minValue} - ${this.props.maxValue}`
            if (this.props.minValue)
                return `> ${this.props.minValue}`
            if (this.props.maxValue)
                return ` < ${this.props.maxValue}`
        }
        return ''
    }
    isInvalid = () =>
        this.props.minValue && parseFloat(this.state.value) < this.props.minValue ||
        this.props.maxValue && parseFloat(this.state.value) > this.props.maxValue

    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value,
        }
    }

    render() {
        return <TextField
            {...this.props}
            value={this.state.value}
            onChange={this.onChange}
            onBlur={this.onBlur}
            helperText={this.getHelperText()}
            error={this.isInvalid()}
        />
    }
}


const TextFieldBranched = caseRender(NumberInput)
    .match((props: { readonly: boolean }) => props.readonly, TextFieldReadOnly)

export default contextedInput(TextFieldBranched)
