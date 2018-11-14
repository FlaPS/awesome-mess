import * as React from 'react'
import {omit} from 'ramda'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import styled from 'styled-components'
import {credentials} from '../store/index'
import IconButton from '../controls/IconButton'
import {colors, Font, Library, restyle} from '../styles'
import {Div} from '../layout'
import {sel, USER, UserVO} from '@local/biz'
import nav from '../app/nav'
import {dispatch} from '../store/'
import {APPBAR_HEIGHT} from '../layout/PageDiv'
import {actions as iso} from '@local/isomorphic'

export type AppBarProps = {
    appLabel: string,
    credentials: credentials.CredentialsState
    user: UserVO
    onMenuClick: (event: any) => any,
    onSearchClick: (event: any) => any,
    onNotificationsCLick: (event: any) => any,
    onUserClick: (event: any) => any,
}

const omitAppBarProps = omit(['appLabel', 'onMenuClick', 'onSearchClick', 'onNotificationsCLick', 'onUserClick'])

const AppBarContainer = styled(Div)`
    display: flex;
    align-items: center;
`

// TODO: resolve problem with mui styles overlaps createUser styles

const Menu = restyle`
    color: ${colors.WHITE} !important;
    margin: 0 12px;
`(IconButton)

const Label = restyle`
    color: ${colors.WHITE};
    font-size: 20px;
    font-weight: 500;
`(Font.FontFamily(Div))

const Search = restyle`
    color: ${colors.WHITE};
    margin-right: 16px;

    &:hover {
        cursor: pointer;
    }
`(Library.Search)

const Notification = restyle`
    color: ${colors.WHITE};
    margin-right: 24px;

    &:hover {
        cursor: pointer;
    }
`(Library.Notification)

const UserAvatar = styled(Div)`
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background-color: ${colors.PRIMARY};
`

const UserName = restyle`
    color: ${colors.WHITE};
    font-size: 14px;
    font-weight: 500;
    margin: 0 12px 0 16px;

    &:hover {
        cursor: pointer;
    }
`(Font.FontFamily(Div))

const FixedHeader = styled(Div)`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;

    width: 100%;
    height: ${APPBAR_HEIGHT}px;
    background-color: #37474f;
    box-shadow:
        0 4px 5px 0 rgba(0, 0, 0, 0.14),
        0 1px 10px 0 rgba(0, 0, 0, 0.12),
        0 2px 4px -1px rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Dropdown = restyle`
    color: ${colors.WHITE};
    margin-right: 24px;

    &:hover {
        cursor: pointer;
    }
`(Library.ArrowDown)

const AppBar = (props: AppBarProps) => (
    <FixedHeader {...omitAppBarProps(props)}>
        <AppBarContainer>
            <Menu onClick={props.onMenuClick}>
                <Library.Hamburger/>
            </Menu>
            <Label>
                {props.appLabel}
            </Label>
        </AppBarContainer>
        <AppBarContainer>
            <Search
                onClick={props.onSearchClick}
            />
            <Notification
                onClick={() =>
                    props.user &&
                    dispatch(push(nav.app.access.user.get(props.user)))
                }
            />
            <UserAvatar/>
            <UserName
                onClick={() =>
                    props.user &&
                    dispatch(push(nav.app.access.user.get(props.user)))
                }
            >
                {props.user && props.user.lastName}
            </UserName>
            <Dropdown
                onClick={() => {
                    dispatch(iso.client.logout())
                    dispatch(push(nav.auth.index.path))
                }}
            />
        </AppBarContainer>
    </FixedHeader>
)

const mapStateToProps = state => ({
    credentials: state.credentials,
    user: state.credentials.userId
        ? sel(USER).byKey(state.credentials.userId)(state)
        : undefined,
})

export default connect(mapStateToProps)(AppBar)
