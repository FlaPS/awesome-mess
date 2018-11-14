import * as React from 'react'
import {restyle} from '../styles/restyle'
import {caption} from '../styles/font'

import Menu from 'material-ui/Menu'
import MenuItem from '../layout/MenuItem'
import {Library} from '../styles/SVGLibrary'

export type MaxRowsMenuState = {
    anchorEl: any
    open: boolean
    selectedIndex: number
}

type MaxRowsMenuProps = {
    onPage: number
    currentOption: number
    options: number[]
    onOptionChange: (maxRows: number) => void
}

const MaxRowsMenuContainer = caption(restyle`
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 36px 0 0;
`)('span')

export default class MaxRowsMenu extends React.Component<MaxRowsMenuProps, MaxRowsMenuState> {
    private handleClickListItem = event => {
        this.setState({open: true, anchorEl: event.currentTarget})
    }
    private handleMenuItemClick = (index: number) => {
        const newState = {
            selectedIndex: index,
            open: false,
        }

        this.setState(newState, () => {
            this.props.onOptionChange(this.props.options[this.state.selectedIndex])
        })
    }
    private handleRequestClose = () => {
        this.setState({open: false})
    }
    private renderMenuItem = (option: number, index: number) => (
        <MenuItem
            key={option}
            selected={index === this.state.selectedIndex}
            onClick={() => this.handleMenuItemClick(index)}
        >
            {option}
        </MenuItem>
    )

    constructor() {
        super()

        this.state = {
            anchorEl: null,
            open: false,
            selectedIndex: 0,
        }
    }

    componentWillReceiveProps(nextProps: MaxRowsMenuProps) {
        if (this.props.currentOption !== nextProps.currentOption) {
            const selectedIndex = nextProps.options.indexOf(nextProps.currentOption)

            this.setState({selectedIndex})
        }
    }

    render() {
        const {ArrowDown} = Library
        return (
            <span>
                <MaxRowsMenuContainer
                    aria-controls='lock-menu'
                    aria-label='Max rows count'
                    onClick={this.handleClickListItem}
                >
                    {`На странице: ${this.props.onPage}`}
                    <ArrowDown style={{marginLeft: 8}}/>
                </MaxRowsMenuContainer>
                <Menu
                    id='lock-menu'
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                >
                    {this.props.options.map(this.renderMenuItem)}
                </Menu>
            </span>
        )
    }
}
