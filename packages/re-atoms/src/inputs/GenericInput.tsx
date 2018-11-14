import * as React from 'react'
import TextInput, {TextInputProps} from './TextInput'
import caseRender from '../smart/caseRender'
import {ValueMeta} from '@local/biz'
import {NumberInput} from './NumberInput'
import RefInput from './RefInput'
import {DateRangePicker} from './DateRangePicker'
import DateInput from './DateInput'
import {InputProps} from './inputProps'
import moize from 'moize'


const MatchInput = caseRender(TextInput)
    .match<{ meta: ValueMeta }>(
        props => props.meta.type === 'number',
        NumberInput
    )
    .match(
        props => props.meta.type === 'itemOf',
        ({meta, ...props}) => {
            // @ts-ignore
            return <RefInput  {...props}  />
        }
    )
    .match(
        props => props.meta.type === 'datetime' || props.meta.type === 'date',
        DateInput
    )
    .match(
        props => props.meta.type === 'daterange',
        DateRangePicker
    )

const MetaInput = ({meta, ...props}: TextInputProps & { meta: ValueMeta }) =>
    <MatchInput label={meta.langRU} required={meta.required} {...props} meta={meta}/>

const GenericInput = (props: InputProps<any> & { scheme: any, property: string }) => {
    const scheme = props.scheme
    const property = scheme.properties[props.property]

    return <MetaInput
        // @ts-ignore
        {...props}
        meta={scheme.properties[props.property] as any as ValueMeta}
    />
}

const Memoized = moize(GenericInput, {maxSize: 100, isReact: true})
window['memoGenericInput'] = Memoized

export default Memoized
