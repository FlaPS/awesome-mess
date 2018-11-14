import * as React from 'react'
import {Column} from '../../grids/grid/Grid'
import {sel, WELL, WellVO} from '@local/biz'
import {getReferenceColumn} from '../../grids/grid/gridHelpers'

export const columnsWell: Column<WellVO, {}>[] = [
    {
        title: 'Скважина',
        dataIndex: 'wellId',
        render: (id, record) => sel(WELL).getFullName(record)(),
    },
    getReferenceColumn(WELL)('wellPurposeId'),
    getReferenceColumn(WELL)('wellStatusId'),
]

