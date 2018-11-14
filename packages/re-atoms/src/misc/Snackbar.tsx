import getFrontendStore, {ui} from '../store/'
import * as React from 'react'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import {connect} from 'react-redux'

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
})

const dispatchReject = () =>
    getFrontendStore().dispatch(ui.actions.reject())

const dispatchApprove = () =>
    getFrontendStore().dispatch(ui.actions.hideMessage())

const Bar = (props: { ui: ui.UIState, classes: any }) =>
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        open={props.ui.snackbar.text !== undefined}
        SnackbarContentProps={{
            'aria-describedby': 'message-id',
        }}
        message={<span id='message-id'>{props.ui.snackbar.text}</span>}
        action={[
            <Button key='undo' color='accent' dense onClick={dispatchReject}>
                Отменить
            </Button>,
            <IconButton
                key='close'
                aria-label='Close'
                color='inherit'
                className={props.classes.close}
                onClick={dispatchApprove}
            >
                <   CloseIcon/>
            </IconButton>,
        ]}
    />

const ConnectedBar = connect(state =>
    ({ui: ui.selector(state)})
)(withStyles(styles)(Bar))

export default ConnectedBar
