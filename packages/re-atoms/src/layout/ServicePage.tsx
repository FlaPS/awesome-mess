import * as React from 'react'
import Paper from './Paper'
import {HeadLine} from '../styles/Typography'

const backgroundStyle = {
    width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
    paddingTop: '100px',
}

const cardStyle = {
    maxWidth: '400px',
    width: '80%',
    margin: 'auto',
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingBottom: '15px',
}

type ServiceCardProps = {
    children?: any
    title?: string
    width?: number | string
}

export default (props: ServiceCardProps) =>
    <div style={backgroundStyle}>
        <Paper style={cardStyle}>
            {props.title &&
            <HeadLine>{props.title}</HeadLine>
            }
            {props.children}
        </Paper>
    </div>
