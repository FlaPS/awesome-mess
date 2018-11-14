import * as React from 'react';
import {PROJECT, schemeLens, USER} from '@local/biz'
import RefTemplate from '../RefTemplate/RefTemplate'
import {DeletedCell} from '../RefTemplate/RefGridTemplate'
import RefNameInput from '../RefNameInput'
import forkConnect from '../../smart/forkConnect'
import Grid from '../../grids/grid/Grid'
import {getUserName} from '../refUtils'

const WellProjectsNameInput = RefNameInput(PROJECT)

// TODO: убрать костыль из рендера колонки с именем ( сейчас сделано из за автосортировки в таблице )

const projectsColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'projectId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) => (
            <DeletedCell removed={item.removed}>
                {WellProjectsNameInput(item, owner.props.dispatch)}
            </DeletedCell>
        ),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item) => (
            <DeletedCell removed={item.removed}>
                <div style={{float: 'right'}}>{getUserName(value)}</div>
            </DeletedCell>
        ),
    },
]

const WellProjectRef = props => (
    <RefTemplate
        {...props}
        refScheme={PROJECT}
        columns={projectsColumns}
    />)

const ConnectedWellProjectRef = forkConnect(state => ({
    data: schemeLens(PROJECT).get(state),
    users: schemeLens(USER).get(state),
}))(WellProjectRef)

export default ConnectedWellProjectRef
