import * as React from 'react'
import props from './props'

type Props = {
    a: string
    b: string
    c: string
    k: string
}

const Component = (props: Props) =>
    <div>
        {JSON.stringify(props)}
    </div>

const Connected = props(Component)
    .connectProp('a', () => state => state.biz.reportFormId[0].name)
    .connectProp('b', (props: { m: string }) => state => props.m.length.toString())
    .defaultProp('k', '12')


// success
const t0 = () => <Connected c='c' m='m'/>

// error cause "m" injected as props
const t1 = () => <Connected c='17'/>

// error cause "a" omiteded by prop('a', ...)
const t2 = () => <Connected a='17' c='c' m='m'/>

// error, cause "c: prop was nither connected or defined
const t3 = () => <Connected m='m'/>

// success, cause of optional k after defaultProp
const t4 = () => <Connected c='c' m='m' k='12'/>








