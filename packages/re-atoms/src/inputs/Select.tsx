import * as React from 'react'
import Select from 'material-ui/Select'
import MenuItem from '../layout/MenuItem'
import Input, {InputLabel} from 'material-ui/Input'
import {AssociativeArray, toIndexedArray} from '@local/utils'
import {FormControl, FormHelperText} from 'material-ui/Form'
import {BindInputProps} from '../smart/form/bindInput'
import contextedInput from './contextedInput'
import InputReadonly from './InputReadonly'

export type DumbSelectProps = {
    label: string
    data: string[] | number[]
    value: string
    disabled?: boolean
    readonly?: boolean
} & BindInputProps<any>

export type SelectProps<D> = {
    uniqueProperty: keyof D
    data: AssociativeArray<D>
    labelPropName?: keyof D
    labelGetter?: (item: D) => string

} & BindInputProps<D>

const renderDumbItem = (value: number | string, i): JSX.Element =>
    <MenuItem key={i} value={value}>
        {value}
    </MenuItem>

const renderItem =
    (labelPropName, labelGetter, uniqueProperty) =>
        (item, i: number) => {
            return <MenuItem key={i} value={item[uniqueProperty]}>
                {
                    labelGetter
                        ? labelGetter(item)
                        : item[(labelPropName || 'name')]
                }
            </MenuItem>
        }

const input =
    uniqueProp =>
        <Input id={`select-${uniqueProp}`}/>

const MenuProps = {
    PaperProps: {
        style: {maxHeight: '50vh'},
    },
}

const BasicSelect =
    (props: DumbSelectProps) => {
        const id = Math.random()
        return (
            <FormControl fullWidth error={props.error}>
                <InputLabel htmlFor={`select-${id}`}>
                    {`${props.label}${props.required ? ' *' : ''}`}
                </InputLabel>

                <Select
                    value={props.value}
                    onChange={({target: {value}}) => props.onChange(value)}
                    input={input(id)}
                    MenuProps={MenuProps}
                >
                    <MenuItem value={''}/>

                    {props.data.map(renderDumbItem)}
                </Select>
                <FormHelperText>{props.helperText}</FormHelperText>
            </FormControl>
        )
    }

const EnhancedSelect =
    <D extends {}>(props: SelectProps<D>) => (
        <FormControl fullWidth error={props.error}>
            <InputLabel htmlFor={`select-${props.uniqueProperty}`}>
                {`${props.label}${props.required ? ' *' : ''}`}
            </InputLabel>

            <Select
                value={props.value || ''}
                onChange={({target: {value}}) => props.onChange && props.onChange(value)}
                input={input(props.uniqueProperty)}
                MenuProps={MenuProps}
            >
                <MenuItem value={''}/>

                {toIndexedArray(props.data).map(renderItem(props.labelPropName, props.labelGetter, props.uniqueProperty))}
            </Select>
            <FormHelperText>{props.helperText}</FormHelperText>
        </FormControl>
    )

const getReadonlyName = ({data, value, uniqueProperty, labelGetter, labelPropName}) => {
    const item = toIndexedArray(data).find(item => item[uniqueProperty] === value) as { name?: string }
    return item
        ? (labelGetter
            ? labelGetter(item)
            : item[(labelPropName || 'name')])
        : ''
}


const SelectContexted: React.SFC<SelectProps<any>> = (props: SelectProps<any>) =>
    props.readonly
        ? <InputReadonly {...props} value={getReadonlyName(props)}/>
        : <EnhancedSelect {...props} />

const DumbSelectContexted: React.SFC<DumbSelectProps> = (props: DumbSelectProps) =>
    props.readonly
        ? <InputReadonly {...props} />
        : <BasicSelect {...props} />

export const DumbSelect = contextedInput<DumbSelectProps>(DumbSelectContexted)

export default contextedInput<SelectProps<any>>(SelectContexted)
