import * as React from 'react'

export type HeadProps = React.HTMLAttributes<HTMLHeadingElement>


const H1: React.SFC<HeadProps> = (props: HeadProps) =>
    <h1 {...props} />

export default H1
