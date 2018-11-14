import * as React from 'react'
import * as moment from 'moment'
import Grid, {Column} from '../../../grids/grid/Grid'
import {Spans} from '../../../layout/Span'
import {sel, WELL, WellVO} from '@local/biz'
import {getReferenceColumn} from '../../../grids/grid/gridHelpers'

import Library from '../../../styles/SVGLibrary'
import IconButton from '../../../controls/IconButton'
import SearchMatch from '../../../controls/SearchMatch'

export const columnsWells: Column<WellVO, {}>[] = [
    {
        title: '',
        dataIndex: 'removed',
        classNames: Grid.cellClasses.icon,
        render: (_, record) => <Library.Well fill='#757575'/>,
    },
    {
        title: 'Наименование',
        dataIndex: 'wellId',
        classNames: Grid.cellClasses.leftAlign,
        render: (_, record) => sel(WELL).getFullName(record)(),
    },
    getReferenceColumn(WELL)('wellStatusId'),
    {
        title: 'Дата начала',
        dataIndex: 'startDate',
        render: time => <Spans.Caption>
            <SearchMatch>{time ? moment(time).format('LL') : 'неизвестно'}</SearchMatch>
        </Spans.Caption>,
    },
    {
        title: '',
        dataIndex: 'clusterNumber',
        classNames: Grid.cellClasses.icon,
        render: (_, record) => (
            <IconButton
                onClick={evt => {
                    evt.stopPropagation()
                    alert(`click on ${record.wellId}`)
                }}
            >
                <Library.Dots/>
            </IconButton>
        ),
    },
]




