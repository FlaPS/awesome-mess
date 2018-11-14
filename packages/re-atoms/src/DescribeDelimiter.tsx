import * as React from 'react'

import Typography from 'material-ui/Typography'

export type DescribeDelimiterProps = {
    icon?: string
    text?: string
    children?: any
    style?: any
}

const delimiterStyle = (props: DescribeDelimiterProps) => ({
    backgroundColor: 'rgba(245,245,246,0.5)',
    height: '32px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    ...props.style,
})

const text = (props: DescribeDelimiterProps) => props.text && (
    <Typography type='body2'>
        {props.text}
    </Typography>
)

export default (props: DescribeDelimiterProps) => (
    <div style={delimiterStyle(props)}>
        {text(props)}
        {props.children}
    </div>
)
