import * as moment from 'moment'
import {Column} from '../../grids/grid/Grid'
import {AssociativeArray} from '@local/utils'
import {GroupSpec, GroupVO, UserVO} from '@local/biz'
import SearchMatch from '../../controls/SearchMatch'
import Span from '../../layout/Span'
import {head, toUpper} from 'ramda'
import {caption} from '../../styles/font'
import Div from '../../layout/Div'
import {restyle} from '../../styles/restyle'
import {compose} from 'recompose'
import * as React from 'react'

const GrayItem = caption()(Span)
const upperHeadWithDot = compose(char => `${char}.`, toUpper, head)

const RightAligned = restyle`
    text-align: right;
`(Div)

const getUsersInGroup =
    (groupId: string, users: AssociativeArray<UserVO>) =>
        Object.keys(users)
            .map(key => users[key])
            .filter((user: UserVO) => user.groupId === groupId)
            .length

export const columnsGroup: Column<GroupVO & GroupSpec, { users: AssociativeArray<UserVO> }>[] = [
    {
        title: 'Название',
        dataIndex: 'name',
    }, {
        title: 'Пользователи',
        dataIndex: 'groupId',
        sorter: ({users}) => (groupA, groupB) =>
            getUsersInGroup(groupA.groupId, users) - getUsersInGroup(groupB.groupId, users),

        renderHeader: title => <RightAligned>{title}</RightAligned>,
        render: (groupId, _, grid) => <RightAligned>{getUsersInGroup(groupId, grid.props.users)}</RightAligned>,
    }, {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        render: (creatorId, group, grid) => {
            const {firstName, patrName, lastName}: UserVO = grid.props.users[creatorId]
            return `${lastName} ${upperHeadWithDot(firstName)} ${upperHeadWithDot(patrName)}`
        },
    }, {
        title: 'Дата создания',
        dataIndex: 'created',
        sorter: () => (a, b) => moment(a.creationDate).isBefore(b.creationDate) ? -1 : 1,
        render: date => <GrayItem><SearchMatch>{moment(date).format('DD MMM YYYY')}</SearchMatch></GrayItem>,
    },
]