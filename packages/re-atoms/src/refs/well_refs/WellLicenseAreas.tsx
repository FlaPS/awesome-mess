import * as React from 'react'
import {actions, schemeLens, USER, WELL_LICENSE_AREA} from '@local/biz'
import RefTemplate from '../RefTemplate/RefTemplate'
import * as moment from 'moment'
import RefNameInput from '../RefNameInput'
import forkConnect from '../../smart/forkConnect'
import Grid from '../../grids/grid/Grid'
import TextField from 'material-ui/TextField'
import {getUserName} from '../refUtils'

const WellLicenseAreasNameInput = RefNameInput(WELL_LICENSE_AREA)

const wellPlacesColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            WellLicenseAreasNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Лицензия до',
        dataIndex: 'expirationDate',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            <TextField
                disabled={item.removed}
                onChange={e =>
                    owner.props.dispatch(
                        actions.update(WELL_LICENSE_AREA, item.wellLicenseAreaId, {expirationDate: e.target.value})
                    )
                }
                value={moment(value).format('YYYY-MM-DD')}
                type={'date'}
            />,
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const WellLicenseAreaRef = props => <RefTemplate {...props} refScheme={WELL_LICENSE_AREA} columns={wellPlacesColumns}/>

const ConnectedWellLicenseAreasRef = forkConnect(state => ({
    data: schemeLens(WELL_LICENSE_AREA).get(state),
    users: schemeLens(USER).get(state),
}))(WellLicenseAreaRef)

export default ConnectedWellLicenseAreasRef
