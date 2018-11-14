import * as React from 'react'
import caseRender from './caseRender'

type Props = {
    a: number
}

const A = (props: Props) =>
    <div>
        {props.a.toFixed()}
    </div>

const withB = caseRender(A)
