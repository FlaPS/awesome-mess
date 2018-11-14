import * as React from 'react'
import * as Typography from '../styles/font'

export type SpanProps = React.HTMLAttributes<HTMLSpanElement>

const Span: React.SFC<SpanProps> =
    (props: SpanProps) =>
        <span {...props} />

const HeadLine = Typography.headLine()(Span)
const Title = Typography.title()(Span)
const Subheading = Typography.subheading()(Span)
const Body2 = Typography.body2()(Span)
const Body1 = Typography.body1()(Span)
const Caption = Typography.caption()(Span)
const Caption2 = Typography.caption2()(Span)

export const Spans = {
    HeadLine,
    Title,
    Subheading,
    Body2,
    Body1,
    Caption,
    Caption2,
}

export default Span
