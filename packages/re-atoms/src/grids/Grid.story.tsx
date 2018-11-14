import * as React from 'react'
import moment from 'moment'
import 'moment/locale/ru'
import {compose, head, toUpper} from 'ramda'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {Provider} from 'react-redux'

import {Column, default as Grid, makeGrid} from './grid/Grid'
import Paper from 'material-ui/Paper'

import getStore from '../store/'
import {GroupVO, UserVO} from '@local/biz'
import {RoleBox} from '../roles/Rolebox/RoleBox'
import {caption} from '../styles/font'
import Span from '../layout/Span'
import {AssociativeArray} from '@local/utils'
import {compose as Rcompose, withHandlers, withState} from 'recompose'
import {Pure} from '../smart/Pure'
import makeValue from '../smart/makeValue'

const GrayItem = caption()(Span)

const getUsersInGroup =
    (groupId: string, users: AssociativeArray<UserVO>) => {
        return Object.keys(users)
            .map(key => users[key])
            .filter((user: UserVO) => user.groupId === groupId)
            .length
    }

const upperHeadWithDot = compose(char => `${char}.`, toUpper, head)

const userGroupGridColumns: Column<GroupVO, { users: AssociativeArray<UserVO> }>[] = [
    {
        title: 'П.п',
        dataIndex: 'groupId',
        classNames: [Grid.cellClasses.short, Grid.cellClasses.centerAlign],
    }, {
        title: 'Название',
        dataIndex: 'name',
    }, {
        title: 'Пользователи',
        dataIndex: 'groupId',
        classNames: [Grid.cellClasses.centerAlign, Grid.cellClasses.short],
        render: (groupId, _, {users}) => getUsersInGroup(groupId, users),
    }, {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        render: (creatorId, group, props) => {
            const {firstName, patrName, lastName}: UserVO = props.users[creatorId]
            return `${lastName} ${upperHeadWithDot(firstName)} ${upperHeadWithDot(patrName)}`
        },
    }, {
        title: 'Дата создания',
        dataIndex: 'creationDate',
        render: date => <GrayItem>{moment(date).format('DD MMM YYYY')}</GrayItem>,
    },
]

const userGridColumns: Column<UserVO>[] = [
    {
        title: 'ФИО',
        dataIndex: 'userId',
        render: (_, vo) => `${vo.lastName} ${vo.firstName} ${vo.patrName}`,
    }, {
        title: 'Роли',
        dataIndex: 'roleIds',
        renderHeader: title => <div style={{textAlign: 'right'}}>{title}</div>,
        render: roleIds => <RoleBox values={roleIds} style={{textAlign: 'right'}}/>,
    }, {
        title: 'Организация',
        dataIndex: 'organization',
    }, {
        title: 'Должность',
        dataIndex: 'position',
    }, {
        title: 'Был в системе',
        dataIndex: 'lastVisitTime',
        render: time => <GrayItem>{moment(time).fromNow()}</GrayItem>,
    },
]

const UserGrid = Pure()
    .of(makeGrid(userGridColumns))
    .connect(state => ({data: state.biz.users}))

const UserGroupGrid = Pure()
    .of(makeGrid(userGroupGridColumns))
    .connect(state => ({data: state.biz.userGroups}))
    .connect(state => ({users: state.biz.users}))


const withSelections = Rcompose(
    withState('selectedIds', 'onSelect', []),
    withHandlers({onSelect: ({onSelect}) => values => onSelect(_ => values)})
)

const UserGroupGridWithSelections = withSelections(({selectedIds, onSelect, ...props}: any) => (
    <UserGroupGrid
        value={selectedIds}
        onChange={onSelect}
        {...props}
    />
))

const SimpleGrid = UserGrid
    .concat(makeValue())

declare const module
storiesOf('Grid', module)
    .add('UserGrid', () => (
        <Provider store={getStore()}>
            <Paper>
                <SimpleGrid
                    idKey={'userId'}
                    columns={userGridColumns}
                    withPagination
                    mode='select'
                    maxRowsItems={[5, 10]}
                />
            </Paper>
        </Provider>
    ))
    .add('UserGroupGrid', () =>
        <Provider store={getStore()}>
            <Paper>
                <UserGroupGrid
                    idKey={'groupId'}
                    columns={userGroupGridColumns}
                    withPagination={false}
                />
            </Paper>
        </Provider>
    )
    .add('UserGroupGrid with selection', () =>
        <Provider store={getStore()}>
            <Paper>
                <UserGroupGridWithSelections
                    mode={'select'}
                    idKey={'groupId'}
                    withPagination
                    maxRowsItems={[3, 10]}
                />
            </Paper>
        </Provider>
    )
    .add('UserGroupGrid with multiselection by checkbox', () =>
        <Provider store={getStore()}>
            <Paper>
                <UserGroupGridWithSelections
                    mode={'multiSelect'}
                    idKey={'groupId'}
                    withPagination
                    maxRowsItems={[3, 10]}
                    onRowClick={action('rowClick!')}
                />
            </Paper>
        </Provider>
    )
    .add('UserGroupGrid with multiselection by row', () =>
        <Provider store={getStore()}>
            <Paper>
                <UserGroupGridWithSelections
                    mode={'multiSelect'}
                    idKey={'groupId'}
                    withPagination
                    maxRowsItems={[3, 10]}
                />
            </Paper>
        </Provider>
    )
    .add('UserGroupGrid with default sort', () =>
        <Provider store={getStore()}>
            <Paper>
                <UserGroupGridWithSelections
                    mode={'multiSelect'}
                    idKey={'groupId'}
                    withPagination
                    maxRowsItems={[3, 10]}
                />
            </Paper>
        </Provider>
    )
