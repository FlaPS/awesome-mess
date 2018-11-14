import * as React from 'react'

const contexted = <T = {}>(contextTypes: T) =>
    <P>(Component: React.ComponentType<P>): React.ComponentType<P & Partial<Record<keyof T, any>>> =>
        Object.assign(
            (props: P & T, context) => {
                const mapContextToProps =
                    Object.keys(contextTypes).reduce(
                        (acc, key) => {
                            acc[key] = context[key]
                            return acc
                        }, {})

                return React.createElement(Component, Object.assign({}, mapContextToProps, props))
            },
            {
                contextTypes,
            }
        )


export default contexted
