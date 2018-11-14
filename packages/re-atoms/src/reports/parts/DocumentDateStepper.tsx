import * as React from 'react'
import {colors as C, Library} from '../../styles'
import {UnaryFn} from '@local/utils'
import {ButtonLeft, ButtonRight, Caption, Container} from './DocumentStepperElements'
import * as moment from 'moment'

type DocumentNumberStepperProps = {
    data: string[]
    value: string
    onChange: UnaryFn<string, void>
}

const prevItem = ({data, value}: Partial<DocumentNumberStepperProps>) =>
    data[data.indexOf(value) - 1]

const nextItem = ({data, value}: Partial<DocumentNumberStepperProps>) =>
    data[data.indexOf(value) + 1]

const isFirst = ({data, value}: DocumentNumberStepperProps) =>
    data.indexOf(value) === 0

const isLast = ({data, value}: DocumentNumberStepperProps) =>
    data.indexOf(value) === data.length - 1

const getLabel = value => moment(value).format('DD MMM YYYY')

export default (props: DocumentNumberStepperProps) =>
    <Container>
        <ButtonLeft onClick={() => props.onChange(prevItem(props))} disabled={isFirst(props)}/>
        <Caption>
            <Library.Calendar fill={C.SOFT_BLACK} style={{paddingRight: 5}}/>
            {getLabel(props.value)}
        </Caption>
        <ButtonRight onClick={() => props.onChange(nextItem(props))} disabled={isLast(props)}/>
    </Container>
