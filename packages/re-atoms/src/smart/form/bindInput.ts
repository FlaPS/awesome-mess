import {Scheme, schemes} from '@local/biz'
import {assocPath, head, path, tail} from 'ramda'
import {InputProps} from '../../inputs/inputProps'
import moize from 'moize';


type OnChangeParam = {
    property: string
    value: any
}

export type BindProps<T> = {
    model?: T
    errors?: any
    dispatch?: any
    onlyTouchedErrors?: boolean
    touched?: any
    scheme?: Scheme<T>
    onChange?: (obj: OnChangeParam) => any
    helperText?: string
}

const change = moize(
    (property: string, onChange: (obj: OnChangeParam) => any) => ((e, value) => {
        if (e['property'] && e['value']) {
            value = e.value
        } else if (typeof(value) !== 'boolean') {
            if (e['target'])
                value = e.target.value
            else
                value = e
        }

        if (onChange)
            onChange({property, value})

    })  as any,
    {maxSize: 10000}
)

export type BindInputProps<T = {}> = InputProps<T>

export const bindInput = <T>(property: string) => (props: BindProps<T>) => {
    const scheme = typeof props.scheme === 'string' ? schemes[props.scheme] : props.scheme
    return props.onlyTouchedErrors
        ? ({
            value: props.model && props.model[property] || '',
            onChange: change(property, props.onChange),
            required: scheme
                && scheme.properties
                && scheme.properties[property]
                && scheme.properties[property].required,
            error: props.touched
                && props.touched[property]
                && props.errors
                && props.errors[property]
                && Boolean(props.errors[property][0]),
            helperText: props.touched
                && props.touched[property]
                && (props.errors && props.errors[property]
                    && props.errors[property][0])
                || props.helperText,
            scheme,
            property,
        })
        : ({
            value: props.model && props.model[property] || '',
            onChange: change(property, props.onChange),
            required: scheme
                && scheme.properties
                && scheme.properties[property]
                && scheme.properties[property].required,
            error: props.errors && props.errors[property] && Boolean(props.errors[property][0]),
            helperText: (props.errors && props.errors[property] && props.errors[property][0]) || props.helperText,
            scheme,
            property,
        })
}

export const bindNestInput = <T>(keys: string[]) => props => {
    const headKey = head(keys)
    const restKeys = tail(keys)
    return {
        value: path(keys, props.model) as T,
        onChange: (e, value) => {
            if (typeof(value) !== 'boolean')
                value = e.target.value

            props.onChange(
                {
                    property: headKey,
                    value: assocPath(restKeys, value, props.model[headKey]),
                }
            )
        },
    }
}

export const bindCustomComponent =
    <T>(keys: string[]) =>
        (props: { model, onChange }) => {
            const headKey = head(keys)
            const restKeys = tail(keys)
            return {
                value: path(keys, props.model) as T,
                onChange: value => {
                    props.onChange({
                        property: headKey,
                        value: assocPath(restKeys, value, props.model[headKey]),
                    })
                },
            }
        }
