import * as React from 'react'
import moment from 'moment'

import {caption} from '../../styles/font'
import styled from 'styled-components'

const RightAligned = styled.div`
    text-align: right;
`
const GrayItem = caption()(RightAligned)

export default {
    date: date => <GrayItem>{moment(date).format('DD MMM YYYY')}</GrayItem>,
}