import * as React from 'react'
import {colors, Font, Library, restyle} from '../styles'
import {Div, DivProps} from '../layout'
import styled from 'styled-components'

type SearchProps = DivProps & {
    value: string,
    onChange: (arg: string | undefined) => any,
    isWhite?: boolean
}

type SearchState = {
    value: string,
    expanded: boolean
}

const SearchInputContainer = restyle`
   width: ${props => props.expanded ? '100%' : '0'};
   transition: width .2s ease-in-out;
`(Div)

const SearchBox = restyle`
    position: relative;
    width: 360px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
`(Div)

const CloseIcon = restyle`
    opacity: ${({expanded}) => expanded ? '1' : '0'};
    z-index: ${({expanded}) => expanded ? '2' : '0'};
    position: absolute;
    right: -5px;
    top: 2px;
    color: ${({white}) => white ? colors.WHITE : colors.SOFT_BLACK};

    &:hover {
        cursor: pointer;
    }
`(Library.CloseCross)

const SearchIcon = restyle`
    z-index: 3;
    margin-right: 8px;
    color: ${({white}) => white ? colors.WHITE : colors.SOFT_BLACK};

    &:hover {
        cursor: pointer;
    }
`(Library.Search)

const SearchInput = styled.input`
    color: ${({white}) => white ? colors.WHITE : colors.DEFAULT_BLACK};
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid ${({white}) => white ? colors.HEAVY_WHITE : colors.SOFT_BLACK};
    border-radius: 0;
    display: block;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    padding: 5px 0;
    width: 100%;
    text-align: left;
    background: 0;
    box-shadow: none;
    outline: none;
`

const Placeholder = Font.FontFamily(styled.label`
    color: ${({white}) => white ? colors.DEFAULT_WHITE : colors.DEFAULT_BLACK};
    opacity: ${props => props.expanded && !props.shown ? '0.54' : '0'};
    position: absolute;
    top: 5px;
    left: 32px;
    font-weight: 200 !important;
    transition: left 0.2s ease-in-out;
`)

export default class Search extends React.Component<SearchProps, SearchState> {
    openSearch = () => {
        this.props.onChange(this.state.value)
        this.setState({expanded: true})
    }
    onChange = e => {
        this.props.onChange(e.target.value)
        this.setState({value: e.target.value})
    }
    closeSearch = () => {
        this.props.onChange(undefined)
        this.setState({expanded: false})
    }

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            expanded: false,
        }
    }

    render() {
        const {onChange, ...props} = this.props
        return (
            <SearchBox {...props}>
                <SearchInputContainer expanded={this.state.expanded}>
                    <Placeholder
                        expanded={this.state.expanded}
                        shown={this.state.value.length > 0}
                        white={this.props.isWhite}
                    >
                        Поиск
                    </Placeholder>
                    <CloseIcon
                        white={this.props.isWhite}
                        expanded={this.state.expanded}
                        onClick={this.closeSearch}
                    />
                    <SearchInput white={this.props.isWhite} value={this.state.value} onChange={this.onChange}/>
                </SearchInputContainer>
                <SearchIcon white={this.props.isWhite} onClick={this.openSearch}/>
            </SearchBox>
        )
    }
}
