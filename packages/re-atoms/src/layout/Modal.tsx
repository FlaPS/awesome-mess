import * as React from 'react'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import Button from '../controls/Button'
import renderChildren, {Renderable} from '../smart/renderChildren'


type ModalProps = {
    submitText: string
    cancelText: string
    onSubmit: Function
    onCancel: Function
    title: Renderable
    bodyContent: Renderable
    isOpen?: boolean
}

type ModalState = {
    isOpen: boolean
}

export default class Modal extends React.Component<ModalProps, ModalState> {
    open = () => this.setState({isOpen: true})
    close = () => this.setState({isOpen: false})
    onAbort = () => {
        this.props.onCancel()
        this.close()
    }
    onSubmit = () => {
        this.props.onSubmit()
        this.close()
    }
    renderBody =
        () => {
            const {bodyContent} = this.props

            return typeof this.props.bodyContent === 'string'
                ? <DialogContentText>{bodyContent}</DialogContentText>
                : renderChildren(bodyContent)
        }

    constructor(props) {
        super(props)

        this.state = {isOpen: this.props.isOpen}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen !== this.props.isOpen)
            nextProps.isOpen
                ? this.open()
                : this.close()
    }

    render() {
        const {children, title, onCancel, onSubmit, cancelText, submitText} = this.props

        return (
            <span>
                {
                    children &&
                    React
                        .Children
                        .map(children, child =>
                            (typeof child !== 'string' && typeof child !== 'number')
                            && React.cloneElement(child, {onClick: this.open})
                        )
                }
                <Dialog
                    fullWidth={true}
                    open={this.state.isOpen}
                    onRequestClose={this.onAbort}
                >
                    <DialogTitle>{renderChildren(title)}</DialogTitle>

                    <DialogContent>
                        {this.renderBody()}
                    </DialogContent>

                    <DialogActions>
                        <Button color='primary' onClick={this.onAbort}>
                            {cancelText}
                        </Button>

                        <Button color='primary' onClick={this.onSubmit}>
                            {submitText}
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        )
    }
}
