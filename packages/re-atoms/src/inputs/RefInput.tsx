import * as React from 'react'
import {getScheme, Scheme} from '@local/biz'
import {capitalize} from '@local/utils'
import Select, {SelectProps} from './Select'
import {connect} from 'react-redux'
import {path} from 'ramda'
import {SchemeInputProps} from './inputProps'


const pathToTargetScheme = property => ['properties', property, 'schemeName']

const isNotDeleted = vo => !vo.removed

const getTargetScheme =
    (property: string, scheme: Scheme<any>) =>
        path(pathToTargetScheme(property))(scheme) as Scheme<any>

const promapSelect =
    <S extends Scheme<T>, T, K extends keyof T>
    (state, props: SchemeInputProps<S, T, K> & Partial<SelectProps<any>>): Partial<SelectProps<any>> => {
        try {
            const scheme = getScheme(props.scheme)
            const targetScheme = getScheme(getTargetScheme(props.property, scheme))

            const labelGetter = item => targetScheme.getFullName ? targetScheme.getFullName(item)() : item['name']
            const result = {
                labelGetter,
                data: targetScheme.asMap(isNotDeleted)(state),
                label: props.label || capitalize(targetScheme.lang.singular),
                uniqueProperty: targetScheme.uniqueProperty,
            }

            return result
        }
        catch (e) {

        }
        return {}
    }

export default connect(promapSelect)(Select) as React.ComponentType<SchemeInputProps<any, any, any>>
