import * as React from 'react'
import {Column} from '../../../grids/grid/Grid'
import {DRILL_RIG, DrillRigVO} from '@local/biz'
import {defaultProps} from 'recompose'
import {getReferenceColumn} from '../../../grids/grid/gridHelpers'


export const columnsDrillRigs: Column<DrillRigVO, {}>[] = [
    {
        title: 'Название',
        dataIndex: 'name',
    },
    getReferenceColumn(DRILL_RIG)('ownerId'),
    getReferenceColumn(DRILL_RIG)('typeId'),
    {
        title: 'Грузоподъёмность',
        dataIndex: 'capacity',
        render: value => `${value} т.`,
    }, {
        title: 'Год выпуска',
        dataIndex: 'productionYear',
    },
]

