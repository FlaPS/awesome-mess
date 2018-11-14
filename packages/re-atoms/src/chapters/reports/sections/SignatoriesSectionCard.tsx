import * as React from 'react'
import {SectionCard} from './SectionCard'
import {SIGNATORIES} from '@local/biz'
import genericForm from '../../../smart/genericForm'
import connectForm from '../../../smart/connectForm'

const Form =
    genericForm(SIGNATORIES, ['supervisorName', 'drillingForemanName', 'drillingForema'], {withHeader: false})
        .ap(props => <div> {props.model}</div>
        )

const ConnectedForm = connectForm(SIGNATORIES)(Form)

class SignatoriesSectionCard extends SectionCard {
    renderChildren() {
        return <ConnectedForm {...this.props} />
    }
}

export default SignatoriesSectionCard