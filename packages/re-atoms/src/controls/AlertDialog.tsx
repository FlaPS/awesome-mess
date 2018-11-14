import * as React from 'react'

import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle,} from 'material-ui/Dialog'

import Button from './Button'


export type AlertDialogProps = {
    title?: React.ReactNode
    text?: React.ReactNode
    okText?: string
    cancelText?: string
    onOk?: Function
    onCancel?: Function
    open?: boolean
}

export default (props: AlertDialogProps) => (
    <Dialog open={props.open} onRequestClose={props.onCancel}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {props.text}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {props.onCancel &&
            <Button onClick={props.onCancel} color="primary">
                {props.cancelText}
            </Button>
            }
            <Button onClick={props.onOk} color="primary">
                {props.okText}
            </Button>
        </DialogActions>
    </Dialog>
)
