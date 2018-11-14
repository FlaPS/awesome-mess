import * as React from 'react'

export default function <D>(defaultProps: D) {
    return <P extends D>(Comp: React.ComponentType<P>): React.ComponentType<P> =>
        (props: P & D & { children?: React.ReactChildren }, ctx?: any) =>
            React.createElement(
                Comp,
                Object.assign({}, defaultProps, props),
                props.children
            )
}
