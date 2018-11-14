import {makeList} from '../grids/list/List'
import * as biz from '@local/biz'
import {GROUP, GroupVO, PROJECT, ROLE, RoleVO, USER, UserVO, WELL} from '@local/biz'
import props from '../smart/props'
import {dispatch} from '../store/'
import {push} from 'react-router-redux'
import nav from '../app/nav'
import {makeGrid} from '../grids/grid/Grid'
import {columnsWells} from './chapteWells/wells/ColumnsWells'
import col from '../grids/grid/columns'

import {columnsUser} from './access/ColumnsUser'
import {columnsGroup} from './access/ColumnsGroup'
import {AssociativeArray} from '@local/utils'
import pureGrid from '../grids/grid/pureGrid'
import {columnsRole} from './access/ColumnsRole'


export const RawWellList = props(makeList(WELL))
    .defaultProp('onRowClick', well =>
        dispatch(push(nav.app.chapterWells.well.index.get(well)))
    )

export const RawProjectList = props(makeList(PROJECT))
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.chapterWells.project.index.get(item)))
    )

export const RawProjectGrid = props(pureGrid(PROJECT, [
    'name',
    'creatorUserId',
    'creationDate',
    'comment']
))
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.chapterWells.project.index.get(item)))
    )

export const RawUserList = props(makeList(biz.USER))
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.access.user.index.get(item)))
    )

export const RawUserGrid = props(makeGrid(columnsUser))
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.access.user.index.get(item)))
    )

export const RawWellGrid = props(makeGrid(col(WELL).create(columnsWells)))
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.chapterWells.well.index.get(item)))
    )

export const RawUserGroupGrid = props(
    makeGrid<GroupVO, { user: AssociativeArray<UserVO> }>(col(GROUP).create(columnsGroup))
)
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.access.userGroup.index.get(item)))
    )
    .connectProp('users', USER.asMap)

export const RawUserGroupList = props(
    makeList<GroupVO, { users: AssociativeArray<UserVO> }>(GROUP)
)
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.access.userGroup.index.get(item)))
    )
    .connectProp('users', USER.asMap)

export const RawRolesGrid = props(
    makeGrid<RoleVO, { user: AssociativeArray<UserVO> }>(col(ROLE).create(columnsRole))
)
    .defaultProp('onRowClick', item =>
        dispatch(push(nav.app.access.role.index.get(item)))
    )
    .connectProp('users', USER.asMap)
