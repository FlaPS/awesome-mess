import * as React from 'react'
import TextInput from './TextInput'
import props from '../smart/props'
import * as moment from 'moment'


export default props(TextInput)
    .defaultProp('type', 'date')
    .defaultProp(
        'formatter',
        value => value && moment(value).format('LL')
    )
