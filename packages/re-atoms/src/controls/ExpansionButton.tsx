import * as React from 'react'
import {ButtonProps} from './Button'
import IconButton from 'material-ui/IconButton'
import {Library, SvgIconProps} from '../styles/SVGLibrary'
import styled, {keyframes} from 'styled-components'

type ExpansionButtonProps = ButtonProps & {
    value: boolean,
    onChange: (value: boolean) => any
}

type ExpansionButtonState = {
    expanded: boolean,
    animate: boolean
}

type RotatingIconProps = SvgIconProps & ExpansionButtonState

const expand = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(180deg); }
`
const collapse = keyframes`
    0% { transform: rotate(180deg); }
    100% { transform: rotate(0deg); }
`

const StyledButton = styled(IconButton)`
    width: 40px !important;
    height: 40px !important;
`

const RotatingIcon = styled(({animate, expanded, ...props}: RotatingIconProps) => <Library.DropdownDown {...props}/>)`
    animation: ${({animate, expanded}) => animate ? expanded ? expand : collapse : ''} 0.5s;
    transform: rotate(${({expanded}) => expanded ? 180 : 0}deg);
`


export default class extends React.Component<ExpansionButtonProps, ExpansionButtonState> {
    private handleClick = () => {
        this.props.onChange(!this.state.expanded)
        this.setState({expanded: !this.state.expanded})
    }

    constructor(props) {
        super(props)
        this.state = {
            expanded: this.props.value,
            animate: false,
        }
    }

    componentWillReceiveProps(nextProps: ExpansionButtonProps) {
        nextProps.value !== this.props.value
            ? this.setState({animate: true})
            : this.setState({animate: false})
    }

    render() {
        return <StyledButton onClick={this.handleClick}>
            <RotatingIcon animate={this.state.animate} expanded={this.state.expanded}/>
        </StyledButton>
    }
}
