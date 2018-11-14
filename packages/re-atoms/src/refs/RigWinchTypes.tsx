import * as React from 'react'
import {RIG_WINCH_TYPE, schemeLens, USER} from '@local/biz'
import RefTemplate from './RefTemplate/RefTemplate'
import RefNameInput from './RefNameInput'
import forkConnect from '../smart/forkConnect'
import Grid from '../grids/grid/Grid'
import {getUserName} from './refUtils'

const RigWinchTypesNameInput = RefNameInput(RIG_WINCH_TYPE)

const rigWinchTypesColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            RigWinchTypesNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const RigWinchTypeRef = props =>
    (
        <RefTemplate
            {...props}
            refScheme={RIG_WINCH_TYPE}
            columns={rigWinchTypesColumns}
        />)


const ConnectedRigWinchTypeRef = forkConnect(state => ({
        data: schemeLens(RIG_WINCH_TYPE).get(state),
        users: schemeLens(USER).get(state),
    })
)(RigWinchTypeRef)

export default ConnectedRigWinchTypeRef
