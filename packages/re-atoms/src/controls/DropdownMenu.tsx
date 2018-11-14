import * as React from 'react'
import Menu from 'material-ui/Menu'
import MenuItem from '../layout/MenuItem'
import {restyle} from '../styles/restyle'
import Span from '../layout/Span'

export type MenuItem<T> = {
    disabled?: boolean
    renderIcon?: () => React.ReactNode
    renderLabel?: () => React.ReactNode
    value?: T
    onChange?: (value: T) => void
}

type DropDownMenuProps<T> = {
    data: MenuItem<T>[]
}

type DropDownMenuState = {
    isOpen: boolean
}

const IconContainer = restyle`
    max-height: 24px;
    padding-right: 24px;
`(Span)

export const makeDropDownMenu = <T extends {}>(_: MenuItem<T>[] = []) =>
    class DropDownMenu extends React.Component<DropDownMenuProps<T>, DropDownMenuState> {
        anchor: HTMLSpanElement
        toggleMenu =
            state =>
                () => typeof state === 'undefined'
                    ? this.setState({isOpen: !this.state.isOpen})
                    : this.setState({isOpen: state})
        renderMenuItem =
            (item: MenuItem<T>, i: number) =>
                <MenuItem
                    key={i}
                    onClick={() => {
                        if (item.onChange) item.onChange(item.value)
                        this.toggleMenu(false)()
                    }}
                >
                    <IconContainer>
                        {item.renderIcon && item.renderIcon()}
                    </IconContainer>
                    <span>{item.renderLabel && item.renderLabel()}</span>
                </MenuItem>

        constructor() {
            super()

            this.anchor = null
            this.state = {isOpen: false}
        }

        render() {
            return (
                <span>
                    <span
                        ref={anchor => this.anchor = anchor}
                        onClick={this.toggleMenu(true)}
                    >
                        {this.props.children}
                    </span>

                    <Menu
                        open={this.state.isOpen}
                        onClose={this.toggleMenu(false)}
                        anchorEl={this.anchor}
                    >
                        {this.props.data.map(this.renderMenuItem)}
                    </Menu>
                </span>
            )
        }
    }

export default makeDropDownMenu<{}>()
