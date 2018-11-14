import * as React from 'react'
import {CONTRACTOR_TYPE, schemeLens, USER} from '@local/biz'
import RefTemplate from './RefTemplate/RefTemplate'
import RefNameInput from './RefNameInput'
import forkConnect from '../smart/forkConnect'
import Grid from '../grids/grid/Grid'
import {getUserName} from './refUtils'

const ContractorTypesNameInput = RefNameInput(CONTRACTOR_TYPE)

const contractorTypesColumns = [
    {
        title: <span style={{float: 'left'}}>Название</span>,
        dataIndex: 'name',
        classNames: [Grid.cellClasses.noCellPadding],
        render: (value, item, owner) =>
            ContractorTypesNameInput(item, owner.props.dispatch),
    },
    {
        title: 'Создал',
        dataIndex: 'creatorUserId',
        classNames: [Grid.cellClasses.noCellPadding],
        render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
    },
]

const ContractorTypeRef = props =>
    (
        <RefTemplate
            {...props}
            refScheme={CONTRACTOR_TYPE}
            columns={contractorTypesColumns}
        />)


const ConnectedContractorTypeRef = forkConnect(state => ({
        data: schemeLens(CONTRACTOR_TYPE).get(state),
        users: schemeLens(USER).get(state),
    })
)(ContractorTypeRef)

export default ConnectedContractorTypeRef
