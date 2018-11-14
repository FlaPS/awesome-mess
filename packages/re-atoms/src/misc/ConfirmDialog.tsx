import * as React from 'react'
import {connect} from 'react-redux'
import {FrontState} from '../store/index'
import {ui} from '../store/'
import Modal from '../layout/Modal'

export default connect((state: FrontState) => state.ui.confirmDialog)
(({action, text, dispatch, ...props}) =>
    action
        ?
        <Modal
            {...props}
            isOpen={true}
            bodyContent={text}
            onCancel={() => dispatch(ui.actions.confirmCancel())}
            onSubmit={() => dispatch(ui.actions.confirmSubmit())}
        />
        : null
)
