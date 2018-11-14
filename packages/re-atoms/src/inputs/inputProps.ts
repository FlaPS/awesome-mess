import * as React from 'react'
import {Scheme} from '@local/biz'

/**
 * Props for each input
 */
export type InputProps<V> = {
    /**
     * Current value
     */
    value?: V

    /**
     * Callback when value changes and valid inside component
     */
    onChange?: (value: V) => any

    /**
     * mark input as required
     */
    required?: boolean

    /**
     * Mark input as error
     */
    error?: boolean

    /**
     * Helper text, in case or error === true, the info about error
     */
    helperText?: string

    /**
     * The label, text for input description
     */
    label?: React.ReactElement<any> | string

    disabled?: boolean

    readonly?: boolean
}

export type SchemeInputProps<S extends Scheme<T>, T, P extends keyof T> = InputProps<T[P]> &
    {
        scheme: S | string
        property: P
    }