import * as React from 'react'
import {actions, ReferenceItemVO, Scheme} from '@local/biz'
import {formPure} from '../smart/Form'
import LiteTextInput from '../inputs/LiteTextInput'
import {bindInput} from '../smart/form/bindInput'
import moize from 'moize'

export default function <T extends ReferenceItemVO, S extends Scheme<T> = Scheme<T>>(scheme: Scheme<T>) {
    const Input = formPure(scheme, ['name'])
        .ap(props =>
            <LiteTextInput {...bindInput('name')(props)}/>
        )

    return moize(
        (item: Partial<T>, doDispatch) =>
            <Input
                model={item}
                onValid={item => doDispatch(actions.update(scheme, item))}
            />,
        {
            maxSize: 1000,
            maxArgs: 2,
        }
    )
}
