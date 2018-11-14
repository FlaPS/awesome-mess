import * as React from 'react'
import {schemeLens, USER, WELL_PLACE} from '@local/biz'
import RefTemplate from '../RefTemplate/RefTemplate'
import RefNameInput from '../RefNameInput'
import forkConnect from '../../smart/forkConnect'
import Grid from '../../grids/grid/Grid'
import {getUserName} from '../refUtils'


const WellPlacesNameInput = RefNameInput(WELL_PLACE)

const wellPlacesColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            WellPlacesNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const WellPlaceRef = props => <RefTemplate {...props} refScheme={WELL_PLACE} columns={wellPlacesColumns}/>

const ConnectedWellPlacesRef = forkConnect(state => ({
        data: schemeLens(WELL_PLACE).get(state),
        users: schemeLens(USER).get(state),
    })
)(WellPlaceRef)

export default ConnectedWellPlacesRef
