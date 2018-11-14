import * as React from 'react'
import {makeGrid} from '../../../grids/grid/Grid'
import {columnsUser} from '../ColumnsUser'
import Paper from '../../../layout/Paper'
import pureTree from '../../../grids/pureTree'
import {makeCrudToolbar} from '../../../grids/SmartToolbar'
import {TreeMode} from '../../../grids/Expandable'
import {actions, GROUP, GroupVO, pluralize, sel, USER, UserVO,} from '@local/biz'
import {dispatch} from '../../../store/'
import {push} from 'react-router-redux'
import nav from '../../../app/nav'
import {without} from 'ramda'


const getUsersInGroup =
    state =>
        groupId =>
            sel(USER).asList()(state).filter(user => user.groupId === groupId)

const purgeUserGroupFromUsers =
    (groupId: string) =>
        (userIds: string[] = []) =>
            userIds.forEach(userId => {
                dispatch(actions.update(USER, userId, {groupId: undefined}))
            })

const UsersGrid = makeGrid(columnsUser)
const UsersToolbar = makeCrudToolbar<UserVO>()


const purgeUserGroupFromWells =
    ({groupId, wellIds: oldWellIds}: GroupVO) =>
        (removingWellIds: string[] = []) => {
            const wellIds = without(removingWellIds)(oldWellIds)
            dispatch(actions.update(GROUP, groupId, {wellIds}))
        }

export default pureTree<UserVO, { groupId: string }>(USER)
    .connect((state, {groupId}) => ({
        data: getUsersInGroup(state)(groupId),
    }))
    .ap(props =>
        <Paper style={{marginBottom: 25}}>
            <UsersToolbar
                {...props}
                onRequestAdd={() =>
                    dispatch(push(nav.app.access.assignUserGroup.index.get({groupId: props.groupId})))}
                onSelectionCancel={() => props.onModeChange(TreeMode.VIEW)}
                onSelectionSubmit={userIds => {
                    purgeUserGroupFromUsers(props.groupId)(userIds)
                    props.onModeChange(TreeMode.VIEW)
                }}
            >
                {props.mode !== TreeMode.VIEW ?
                    `Выбрано ${pluralize(USER)(props.value && props.value.length)}`
                    :
                    'Пользователи'
                }
            </UsersToolbar>


            <UsersGrid
                idKey={'userId'}
                onRowClick={
                    props.mode === TreeMode.VIEW &&
                    (user => dispatch(push(nav.app.access.user.index.get(user))))
                }
                {...props}
            />
        </Paper>
    )