import * as React from 'react'
import {keys, omit} from 'ramda'
import {isArray} from '@local/utils'

type OmitedKyes<T> = Array<keyof T>

function declareProps<D, Inject = Partial<D>>(declaredPropsOrOmitedKeys?: D | OmitedKyes<D>) {
    return function <P>(Comp: React.ComponentType<P>): React.ComponentClass<P & Inject> {
        return function (props: P & Inject) {
            return <Comp
                {
                    ...omit(isArray(
                        declaredPropsOrOmitedKeys)
                        ? declaredPropsOrOmitedKeys
                        : keys(declaredPropsOrOmitedKeys),
                        props)
                }
            />
        } as any as  React.ComponentClass<P & Inject>
    }
}

export default declareProps


/*
import styled from 'styled-components'

const A = (props: {a: number}) => null


const B = styled(declareProps<{b: number, c: string}>(['b'])(A))`
    ${props => props.c}
`
const b = <B a={17} b={14}/>


const C = styled(declareProps({c: '12'})(A))`
    ${props => props.c}
`
const c = <C a={17} c='17'/>


const D = styled(declareProps<{c: number}>()(A))`
${props => props.c}
`
const d = <C a={17} c='17'/>

const E = styled(declareProps<{a: number, b: string}>(['a'])(A))`
${props => props.a}
`
const e = <C a={17} c='17'/>
*/
