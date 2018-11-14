import * as React from 'react'
import {isEmpty} from 'ramda'
import {FormControl, FormControlLabel, FormLabel} from 'material-ui/Form'
import Radio, {RadioGroup} from 'material-ui/Radio'
import {Spans} from '../layout/Span'
import {BindInputProps} from '../smart/form/bindInput'
import {restyle} from '../styles/restyle'
import contextedInput from './contextedInput'
import TextFieldReadOnly from './InputReadonly'

const RowRadioGroup = restyle`
    display: flex;
    flex-direction: row !important;
    align-items: center;
`(RadioGroup)

type Option = {
    value: any
    label: string
}

export type RadioGroupProps = {
    options: Option[]
    label: string
    readonly?: boolean
    disabled?: boolean
} & BindInputProps<any>

const makeOption = (opt: Option, i: number) =>
    <FormControlLabel
        key={i}
        value={opt.value}
        control={<Radio/>}
        label={opt.label}
    />

export const CustomRadioGroup = ({label, options, ...props}: RadioGroupProps) =>
    <FormControl>
        <FormLabel component={Spans.Caption}>{label}</FormLabel>

        <RowRadioGroup {...props}>
            {options.map(makeOption)}
        </RowRadioGroup>
    </FormControl>

const getLabel = (options: Option[], value: string) =>
    !isEmpty(value)
        ? options.find(opt => String(opt.value) === String(value)).label
        : value

export const ReadonlyRadioGroup = ({label, options, ...props}: RadioGroupProps) =>
    <TextFieldReadOnly label={label.replace(' *', '')} value={getLabel(options, props.value)}/>

const RadioGroupContexted: React.SFC<RadioGroupProps> = (props: RadioGroupProps) =>
    props.readonly
        ? <ReadonlyRadioGroup {...props} />
        : <CustomRadioGroup {...props} />

export default contextedInput<RadioGroupProps>(RadioGroupContexted)
