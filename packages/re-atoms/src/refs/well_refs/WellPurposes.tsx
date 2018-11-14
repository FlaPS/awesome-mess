import * as React from 'react'
import {schemeLens, USER, WELL_PURPOSE} from '@local/biz'
import RefTemplate from '../RefTemplate/RefTemplate'
import RefNameInput from '../RefNameInput'
import forkConnect from '../../smart/forkConnect'
import Grid from '../../grids/grid/Grid'

import {getUserName} from '../refUtils'

const WellPurposesNameInput = RefNameInput(WELL_PURPOSE)

const wellPurposesColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            WellPurposesNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const WellPurposeRef = props => <RefTemplate {...props} refScheme={WELL_PURPOSE} columns={wellPurposesColumns}/>

const ConnectedWellPurposeRef = forkConnect(state => ({
    data: schemeLens(WELL_PURPOSE).get(state),
    users: schemeLens(USER).get(state),
}))(WellPurposeRef)

export default ConnectedWellPurposeRef
