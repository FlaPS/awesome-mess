import * as React from 'react'
import styled from 'styled-components'
import {Div, PageLayout} from '../../layout'
import {DialogActions} from 'material-ui/Dialog'
import {Button} from '../../controls'
import {InputProvider} from '../../InputProvider'
import {Stateful} from '../Stateful'
import Paper from '../../layout/Paper'
import {default as renderChildren, Renderable} from '../renderChildren'
import {restyle} from '../../styles'
import {APPBAR_HEIGHT} from '../../layout/PageDiv'


const Wrapper = styled(Div)`
    .dialog {
        max-width: 2048px !important;
        width: max-content;
    }
`
type EditorProps<T> = {
    model: T
    style?: any
    forked?: boolean
    onValid: (value: T, touched?: boolean) => any
    onInvalid?: (value: T, touched?: boolean) => any
    toggleEditForm?: Function
}

export type DialogEditFormProps<T> = {
    model: T
    disableEditButton?: boolean
    open?: boolean
    viewer: Renderable<{ model?: T, style?: any, toggleEditForm?: Function }>
    editor?: Renderable<EditorProps<T>>
    onEdit?: (value: T) => any
    onOpen?: () => any
    onClose?: () => any
    stretch?: boolean
}

type DialogEditFormState<T> = {
    open?: boolean
    isValid?: boolean
    model: T
    isTouched?: boolean
}

const Overlay = restyle`
    z-index: 1;
    background-color: #f5f5f6;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - ${APPBAR_HEIGHT}px);
    overflow: auto;
`(Div)

const InlineWrap = restyle`
    margin: auto;
    display: inline-block;
`(Div)

export default class DialogEditForm<T> extends Stateful<DialogEditFormProps<T>, DialogEditFormState<T>> {
    lockBodyOverflow = () => {
        document.body.classList.toggle('lockedOverflow', true)
    }
    unlockBodyOverflow = () => {
        document.body.classList.toggle('lockedOverflow', false)
    }
    open = () => {
        const {onOpen} = this.props
        this.lockBodyOverflow()
        this.setState({open: true})

        if (onOpen) onOpen()
    }
    close = () => {
        const {onClose} = this.props

        this.setState({open: false})
        this.unlockBodyOverflow()
        if (onClose) onClose()
    }
    save = () => {
        const {onEdit} = this.props
        if (onEdit) onEdit(this.state.model)

        this.close()
    }
    toggleEditForm = () => this.state.open ? this.close() : this.open()
    renderEditor = () => {
        const {viewer, editor, model} = this.props

        const Editor = editor || viewer as any as React.ComponentType<EditorProps<T>>

        return (
            <Overlay>
                <PageLayout hasBackButton={false}>
                    <InlineWrap>
                        <Paper>
                            <InputProvider>
                                {renderChildren(Editor, {
                                    model: this.state.open ? this.state.model : model,
                                    onValid:
                                        (value: T) =>
                                            this.setState({isValid: true, model: value, isTouched: true}),
                                    onInvalid:
                                        (value: T) =>
                                            this.setState({isValid: false, model: value, isTouched: true}),
                                })}
                            </InputProvider>
                        </Paper>
                        <DialogActions>
                            <Button onClick={this.close}>
                                Отменить
                            </Button>
                            <Button
                                disabled={!this.state.isValid || !this.state.isTouched}
                                onClick={this.save}
                                primary
                            >
                                Сохранить изменения
                            </Button>
                        </DialogActions>
                    </InlineWrap>
                </PageLayout>
            </Overlay>
        )
    }

    constructor(props) {
        super(props)
        const {model, open} = props
        this.state = {model, open}
    }

    componentWillUnmount() {
        this.unlockBodyOverflow()
    }

    componentWillReceiveProps(next: DialogEditFormProps<T>) {
        if (next.open !== this.state.open) {
            if (next.open) {
                this.setState(() => ({open: next.open, model: next.model, isTouched: false}), () => {
                    this.lockBodyOverflow()
                })
            } else {
                this.setState(() => ({open: next.open}), () => {
                    this.unlockBodyOverflow()
                })
            }
        }
    }

    render() {
        const {viewer: Viewer, model} = this.props

        return (
            <Wrapper>
                <InputProvider readonly>
                    <Paper>
                        {renderChildren(Viewer, {
                            model,
                            toggleEditForm: this.toggleEditForm,
                            style: {display: 'inline-block'}
                        })}
                    </Paper>
                </InputProvider>

                {this.state.open && this.renderEditor()}
            </Wrapper>
        )
    }
}

