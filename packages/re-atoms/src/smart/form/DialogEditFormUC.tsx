import * as React from 'react'
import Library from '../../styles/SVGLibrary'
import DialogEditForm, {DialogEditFormProps} from './DialogEditForm'
import styled from 'styled-components'
import Div from '../../layout/Div'
import Span from '../../layout/Span'
import {ACCENT_BLUE, PRIMARY, TRANSPARENT, WHITE} from '../../styles/colors'


const Wrapper = styled(Div)`
    ${
    (props: any) => props.stretch
        ? `
                display: block;
                width: 100%;
            ` : `
                display: inline-block;
                width: max-content;
            `
    }
    position: relative;

    &:hover > *:first-child {
        opacity: 1;
    }
`

const Button = styled(Span)`
    cursor: pointer;
    opacity: 0;
    z-index: 1;
    width: 40px;
    height: 36px;
    position: absolute;
    right: 16px;
    top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${PRIMARY};
    transition: all .25s ease-in;

    color: ${WHITE};
    box-shadow: 0 0 0 0 ${TRANSPARENT};

    border-radius: 2px;

    &:hover {
        box-shadow: 0 2px 2px 0 rgba(37, 37, 37, 0.24), 0 0 2px 0 rgba(37, 37, 37, 0.12);
        background-color: ${ACCENT_BLUE};
    }
`

type DialogEditFormUCProps<T> = DialogEditFormProps<T> & {
    withEditButton?: boolean
}

export default class DialogEditFormUC<T> extends React.Component<DialogEditFormUCProps<T>, { open: boolean }> {
    static defaultProps = {
        withEditButton: true,
    }
    toggle = () => this.setState({open: !this.state.open})

    constructor(props) {
        super(props)

        this.state = {open: false}
    }

    render() {
        const {stretch, ...props} = this.props

        return (
            <Wrapper stretch={stretch}>
                {
                    this.props.withEditButton && (
                        <Button onClick={this.toggle}>
                            <Library.Edit/>
                        </Button>
                    )
                }
                <DialogEditForm open={this.state.open} onClose={this.toggle} {...props} />
            </Wrapper>
        )
    }
}
