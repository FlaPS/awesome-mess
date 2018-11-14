import * as React from 'react'
import {Scheme} from '@local/biz'
import {formPure} from '../smart/Form'
import Paper from '../layout/Paper'
import {Subheading} from '../styles/Typography'

import {bindInput} from '../smart/form/bindInput'
import TextInput from '../inputs/TextInput'


export default function <T>(scheme: Scheme<T>, title: string, propertyNames: Array<keyof T> = ['name'] as any as Array<keyof T>) {
    return formPure(scheme, propertyNames)
        .ap(props =>
            <Paper style={{padding: '32px', width: '600px'}}>
                <Subheading>
                    {title}
                </Subheading>
                <TextInput
                    {...bindInput(propertyNames[0])(props)}
                />
            </Paper>,
        )
}
