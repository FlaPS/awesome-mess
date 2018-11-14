import * as React from 'react'

const defaultHandler = value => console.log(value)

export class Stateful<P, S> extends React.Component<P, S> {
    public stateKey = (key: keyof S) => value =>
        this.setState({[key]: value} as any as S)

    constructor(props) {
        super(props)
        this.state = {} as any as S
    }
}

