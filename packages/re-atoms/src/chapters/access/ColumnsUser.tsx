import * as React from 'react'
import {Column} from '../../grids/grid/Grid'
import {sel, USER, UserVO} from '@local/biz'
import {RoleBox} from '../../roles/Rolebox/RoleBox'
import * as moment from 'moment'
import {caption} from '../../styles/font'
import {restyle} from '../../styles/restyle'
import Div from '../../layout/Div'
import SearchMatch from '../../controls/SearchMatch'


const GrayItem = caption(restyle`
    text-align: right;
`)(Div)

export const columnsUser: Column<UserVO, {}>[] = [
    {
        title: 'ФИО',
        dataIndex: 'userId',
        render: (_, vo) => sel(USER).getFullName(vo)(),
    }, {
        title: 'Роли',
        dataIndex: 'roleIds',
        renderHeader: title => <div style={{textAlign: 'right'}}>{title}</div>,
        render: roleIds => <RoleBox values={roleIds} style={{textAlign: 'right'}}/>,
    }, {
        title: 'Организация',
        dataIndex: 'organization',
    }, {
        title: 'Был в системе',
        dataIndex: 'lastVisitTime',
        render: time => <GrayItem><SearchMatch>{time ? moment(time).fromNow() : 'неизвестно'}</SearchMatch></GrayItem>,
    },
]

