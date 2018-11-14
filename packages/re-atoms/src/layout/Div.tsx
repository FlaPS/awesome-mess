import * as React from 'react'

export type DivProps = React.HTMLAttributes<HTMLDivElement> & {
    width?: number | string
    height?: number | string
}

const Div: React.SFC<DivProps> = (props: DivProps) =>
    <div {...props} />

// const pickDivProps = pick(Object.keys(div.propTypes))

export default Div// (props: DivProps) => <Div {...pickDivProps(props)} />
