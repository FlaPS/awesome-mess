import * as React from 'react'
import {Scheme} from '@local/biz'
import {formPure} from './Form'
import * as R from 'ramda'
import FormSection from '../layout/FormSection'
import GenericInput from '../inputs/GenericInput'
import {bindInput} from './form/bindInput'


const formOptions = {
    withHeader: true
}

export type GenericFormOptions = typeof formOptions

export default function <T, Spec>(scheme: Scheme<T, Spec>, fields?: (keyof T & Spec)[], options = formOptions) {
    type Properties = typeof scheme.properties
    type Keys = keyof Properties
    fields =
        fields ||
        (R.keys(scheme.properties)) as any as (keyof T & Spec)[]

    const Form = formPure(scheme, fields as any as Keys[])
        .ap(props => {
                const inputs = R.map(k => {

                        return <GenericInput

                            {...bindInput(k)(props)}
                            key={k}
                            scheme={scheme}
                            property={k}
                        />
                    },
                    fields)
                if (options.withHeader)
                    return <FormSection label={scheme.lang.singular}>
                        {inputs}
                    </FormSection>
                return inputs as any as React.ReactElement<any>
            }
        )
    return Form

}
