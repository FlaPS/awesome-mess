import * as React from 'react'
import {omit} from 'ramda'
import styled from 'styled-components'
import makeSelect from '../smart/makeValue'
import Div from '../layout/Div'
import {RouteIndex} from '../app/navHelpers'
import {colors, restyle} from '../styles'

export type SideBarMenuItem = {
    icon: any
    label: string
    path: string
}

const omitSidebarItemProps = omit(['icon', 'label', 'selected', 'number', 'onSelectChange'])

const Item = restyle`
    height: 48px;
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
    }
`(Div)

const SidebarItemIcon = restyle`
    margin: 0 32px 0 16px;
    color: ${ props => props.selected ? colors.SELECTED_BLUE : colors.SOFT_BLACK};
`(Div)

const SidebarItem = (props: { item: SideBarMenuItem, selected: boolean, onChange?: any }) =>
    <div {...omitSidebarItemProps(props)} onClick={() => props.onChange(props.item)}>
        <Item>
            <SidebarItemIcon>
                {props.item.icon}
            </SidebarItemIcon>
            {props.item.label}
        </Item>
    </div>

const StyledSidebarItem = restyle`
    background-color: ${ props => props.selected ? colors.SELECTED_GRAY : colors.WHITE};
    color: ${ props => props.selected ? colors.SELECTED_BLUE : colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
`(SidebarItem)

const SideBarMenuDiv = styled(Div)`
    height: 100%;
    width: 280px;
    background-color: ${colors.WHITE};
    display: flex;
    flex-direction: column;
`

const MenuHeader = restyle`
    background-color: ${colors.DEEP_BLUE};
    height: 56px;
    margin-bottom: 9px;
`(Div)

const MenuHeaderContainer = restyle`
    float: right;
    margin: 13px 16px 13px 0;
`(Div)

const MenuLabel = restyle`
    color: ${colors.WHITE};
    font-family: Roboto;
    font-size: 14px;
    font-style: italic;
    font-weight: bold;
`(Div)

const MenuSubLabel = restyle`
    color: ${colors.WHITE};
    font-family: Roboto;
    font-size: 10px;
    line-height: 11px;
`(Div)

const Select = makeSelect<SideBarMenuItem>()

export default Select.ap(props =>
    <SideBarMenuDiv tabIndex={0}>
        <MenuHeader>
            <MenuHeaderContainer>
                <MenuLabel> Отчетность</MenuLabel>
                <MenuSubLabel> Версия 2.0</MenuSubLabel>
            </MenuHeaderContainer>
        </MenuHeader>

        {props.items.map((item: { index: RouteIndex }) => {

                return <StyledSidebarItem
                    key={item.index.path}
                    item={item.index}
                    onChange={props.onChange}
                    selected={item === props.value}
                />
            }
        )}

    </SideBarMenuDiv>
)
