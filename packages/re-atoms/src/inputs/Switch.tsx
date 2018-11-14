import * as React from 'react'
import {FormControlLabel} from 'material-ui/Form'
import SwitchMUI from 'material-ui/Switch'
import contextedInput from './contextedInput'

export type SwitchProps =
    {
        checkedClassName?: string
        checkedIcon?: React.ReactNode
        defaultChecked?: boolean
        disabled?: boolean
        disabledClassName?: string
        disableRipple?: boolean
        icon?: React.ReactNode
        inputProps?: object
        name?: string
        tabIndex?: number
        label?: React.ReactNode | string
        readonly?: boolean
        value?: boolean
    } & {
    onChange?: (value: boolean) => any
}

export const createSwitch = ({value, disabled, readonly, onChange, ...props}: SwitchProps) =>
    <SwitchMUI
        {...props}
        checked={value}
        onChange={(event, checked) => onChange && onChange(checked)}
        disabled={disabled || readonly}
    />

export default contextedInput(
    ({label, ...props}: SwitchProps) =>
        label
            ? <FormControlLabel control={createSwitch(props)} label={label}/>
            : createSwitch(props)
)

