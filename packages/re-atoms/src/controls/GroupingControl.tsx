import * as React from 'react'
import styled from 'styled-components'
import {colors, Font, Library, restyle} from '../styles'
import {Div} from '../layout'

export type GroupingControlProps = {
    data: Array<string>,
    value?: string
    onChange: (id?: string) => void,
}

type GroupingControlState = {
    active: string
}

const ToggleButton = Font.FontFamily(styled.button`
    font-size: 14px;
    line-height: 1.43;
    padding: 0 14px;
    margin-right: 8px;

    box-sizing: border-box;
    height: 26px;
    display: flex;
    align-items: center;
    text-align: center;

    border-width: 1px;
    border-style: solid;
    border-color: ${({active}) => active ? colors.DEEP_BLUE : colors.TRANSPARENT};
    outline: none;

    color: ${({active}) => active ? colors.DEEP_BLUE : colors.SOFT_BLACK};
    background: none;
    border-radius: 2px;
    cursor: pointer;

    &:disabled {
        cursor: default;
        color: ${colors.SOFT_BLACK};
    }
`)

const GroupControlLabel = restyle`
	color: ${colors.SOFT_BLACK};
	font-size: 12px;
	margin-right: 8px;
`(Font.FontFamily(Div))

const FlexContainer = restyle`
    display: flex;
    width: 100%;
    align-items: center;
`(Div)

const ButtonsContainer = restyle`
    display: flex;
    align-items: center;
    justify-content: space-between;
`(Div)

class GroupingControl extends React.Component<GroupingControlProps, GroupingControlState> {
    renderButtons =
        () =>
            this.props.data
                .map((value, index) => (
                    <ToggleButton
                        active={index.toString() === this.state.active}
                        key={`gctrl${index}`}
                        onClick={() => {
                            this.setState({active: index.toString()})
                            this.props.onChange(index.toString())
                        }}
                    >
                        {value}
                    </ToggleButton>
                ))
    renderClearButton =
        () =>
            <ToggleButton
                onClick={() => {
                    this.setState({active: ''})
                    this.props.onChange()
                }}
                active={!this.state.active}
            >
                Без группировки
                <Library.CloseCross style={{height: '16px', width: '16px', marginLeft: '4px'}}/>
            </ToggleButton>

    constructor(props) {
        super(props)
        this.state = {
            active: this.props.value ? this.props.value : '',
        }
    }

    render() {
        return (
            <FlexContainer>
                <GroupControlLabel>Группировка:</GroupControlLabel>
                <ButtonsContainer>
                    {this.renderButtons()}
                    {this.renderClearButton()}
                </ButtonsContainer>
            </FlexContainer>
        )
    }
}

export default GroupingControl
