import * as React from 'react'
import * as moment from 'moment'
import Grid, {Column} from '../../../grids/grid/Grid'
import {Spans} from '../../../layout/Span'
import {WellVO} from '@local/biz'
import Library from '../../../styles/SVGLibrary'
import IconButton from '../../../controls/IconButton'
import SearchMatch from '../../../controls/SearchMatch'

export const columnsProject: Column<WellVO, {}>[] = [
    {
        title: 'Название',
        dataIndex: 'name',
        classNames: Grid.cellClasses.leftAlign,
    },
    {
        title: 'Скважины',

    },
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

