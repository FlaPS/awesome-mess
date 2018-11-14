import * as React from 'react'
import {USER, WELL_STATUS} from '@local/biz'
import RefTemplate from '../RefTemplate/RefTemplate'
import RefNameInput from '../RefNameInput'
import forkConnect from '../../smart/forkConnect'
import Grid from '../../grids/grid/Grid'
import {getUserName} from '../refUtils'

const WellStasusesNameInput = RefNameInput(WELL_STATUS)

const wellStasusesColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            WellStasusesNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const WellStatusRef = props => <RefTemplate {...props} refScheme={WELL_STATUS} columns={wellStasusesColumns}/>

const ConnectedWellStatusRef = forkConnect(state => ({
    data: WELL_STATUS.asMap()(state),
    users: USER.asMap()(state),
}))(WellStatusRef)

export default ConnectedWellStatusRef
