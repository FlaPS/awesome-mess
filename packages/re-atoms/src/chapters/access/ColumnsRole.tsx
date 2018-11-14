import * as React from 'react'
import {RoleSpec, RoleVO, UserVO} from '@local/biz'
import styled from 'styled-components'
import {AssociativeArray} from '@local/utils'
import {caption} from '../../styles/font'
import {Column} from '../../grids/grid/Grid'

const RightAligned = styled.div`
text-align: right;
`
const GrayItem = caption()(RightAligned)

const getUsersWithRole =
    (roleId: string, users: AssociativeArray<UserVO>) =>
        Object.keys(users)
            .map(key => users[key])
            .filter((user: UserVO) => user.roleIds.includes(roleId))
            .length

export const columnsRole: Column<RoleVO & RoleSpec, { users: AssociativeArray<UserVO> }>[] =
    [
        'name',
        {
            title: 'Пользователи',
            dataIndex: 'roleId',
            sorter: ({users}) =>
                (roleA, roleB) =>
                    getUsersWithRole(roleA.roleId, users) - getUsersWithRole(roleB.roleId, users),
            render: (roleId, _, grid) => <RightAligned>{getUsersWithRole(roleId, grid.props.users)}</RightAligned>,
        },
        'creatorUserId',
        'creationDate',
        'comment',
    ]