import * as React from 'react'
import TextField, {TextFieldProps} from 'material-ui/TextField'
import FormHelperTextProps from 'material-ui/Form/FormHelperText'
import InputLabelProps from 'material-ui/Input/InputLabel'
import {InputProps} from 'material-ui/Input'
import contextedInput from './contextedInput'
import caseRender from '../smart/caseRender'
import TextFieldReadOnly, {TextFieldReadonly} from './InputReadonly'
import moize from 'moize';

type Alignment = 'inherit' | 'left' | 'center' | 'right' | 'justify'
type Color = 'inherit' | 'primary' | 'accent' | 'default'
type Margin = 'none' | 'dense' | 'normal'

export type TextInputProps = TextFieldProps & {
    autoComplete?: string
    autoFocus?: boolean
    defaultValue?: string | number
    disabled?: boolean
    error?: boolean
    FormHelperTextProps?: FormHelperTextProps
    fullWidth?: boolean
    helperText?: React.ReactNode
    helperTextClassName?: string
    id?: string
    inputClassName?: string
    InputClassName?: string
    InputLabelProps?: InputLabelProps

    InputProps?: InputProps
    inputRef?: React.Ref<any>
    label?: React.ReactElement<any> | string
    labelClassName?: string
    maxLength?: number
    multiline?: boolean
    name?: string
    placeholder?: string
    required?: boolean
    rootRef?: React.Ref<any>
    rows?: string | number
    rowsMax?: string | number
    type?: string
    value?: string | number
    margin?: Margin
    onChange?: (value: string) => any
    inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement> | React.InputHTMLAttributes<HTMLInputElement>
}
    & TextFieldReadonly


const TextFieldEditable = (props: TextInputProps) =>
    <TextField
        value={props.value}
        // @ts-ignore
        inputProps={{...props.inputProps, maxLength: 170}}
        style={{width: '100%'}}
        {...props}
        onChange={e => props.onChange(e.target.value as any as string)}
        helperText={props.helperText || ' '}
    />

const TextFieldBranched = caseRender(TextFieldEditable)
    .match((props: { readonly: boolean }) => props.readonly, TextFieldReadOnly)

const TextFieldContexted = contextedInput<TextInputProps>(TextFieldBranched)


const Memoized = moize(TextFieldContexted as any, {maxSize: 100, isReact: true}) as any as typeof TextFieldContexted
window['memoTextInput'] = Memoized

export default Memoized
