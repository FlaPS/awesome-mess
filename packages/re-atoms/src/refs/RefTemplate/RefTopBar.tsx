import * as React from 'react'
import {omit} from 'ramda'
import styled from 'styled-components'
import {restyle} from '../../styles'
import Library from '../../styles/SVGLibrary'
import Div from '../../layout/Div'
import DropDownMenu from '../../controls/DropdownMenu'
import IconButton from 'material-ui/IconButton'
import Search from '../../controls/Search'
import colors from '../../styles/colors'

type RefsBarProps = {
    onDownloadClick: () => any
    onShowLogClick: () => any
    onSearch: (value: string) => any
    actual: boolean
    edit: boolean
    label: string
    width?: number
}

const omitRefsBarProps = omit([
    'onDownloadClick',
    'onShowLogClick',
    'onSearchClick',
    'actual',
    'edit',
    'label',
])


const Label = styled.div`
    height: 32px;
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 24px;
    line-height: 32px;
    display: flex;
    align-items: center;
`

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 0 12px 0;
    border-bottom: 1px solid ${colors.BORDER_GRAY};
    align-items: center;
    height: 32px;
    width: ${props => props.width ? props.width : 'auto'}px;
`

const ButtonContainer = restyle`
    display:flex;
    justify-content: space-between;
    align-items: center;
   `(Div)


const makeGrayIcon = Icon => restyle
    `
    color: ${colors.SOFT_BLACK};
    cursor: pointer;
`(Icon)

const SearchIcon = makeGrayIcon(Library.Search)

const DownloadIcon = restyle
    `
    margin-right: 21px;
`(makeGrayIcon(Library.Download))

const ShowLogIcon = restyle
    `
    margin-right: 21px;
`(makeGrayIcon(Library.ShowLog))

const DropDownText = styled.span`
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 15px;
    margin-right: 40px;
`

const LabelBar =
    (props: RefsBarProps) => (
        <FlexContainer {...omitRefsBarProps(props)}>
            <Label>
                {props.label}
            </Label>
            <ButtonContainer>
                <Search style={{top: '1px'}} value={''} onChange={props.onSearch}/>
                <DropDownMenu
                    data={[{
                        renderIcon: () => <DownloadIcon/>,
                        renderLabel: () => <DropDownText>Скачать справочник</DropDownText>,
                        onChange: props.onDownloadClick,
                    }, {
                        renderIcon: () => <ShowLogIcon/>,
                        renderLabel: () => <DropDownText>История изменений</DropDownText>,
                        onChange: props.onShowLogClick,
                    }]}
                >
                    <IconButton style={{marginRight: '-22px'}}><Library.Dots/></IconButton>
                </DropDownMenu>
            </ButtonContainer>
        </FlexContainer>
    )

export default LabelBar
