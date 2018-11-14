import * as React from 'react'
import {schemeLens, USER, WELL_FIELD} from '@local/biz'
import RefTemplate from '../RefTemplate/RefTemplate'
import RefNameInput from '../RefNameInput'
import forkConnect from '../../smart/forkConnect'
import Grid from '../../grids/grid/Grid'
import {getUserName} from '../refUtils'

const WellFieldsNameInput = RefNameInput(WELL_FIELD)

const wellFieldsColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            WellFieldsNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const WellFieldRef = props =>
    (
        <RefTemplate
            {...props}
            refScheme={WELL_FIELD}
            columns={wellFieldsColumns}
        />)


const ConnectedWellFieldRef = forkConnect(state => ({
        data: schemeLens(WELL_FIELD).get(state),
        users: schemeLens(USER).get(state),
    })
)(WellFieldRef)

export default ConnectedWellFieldRef
