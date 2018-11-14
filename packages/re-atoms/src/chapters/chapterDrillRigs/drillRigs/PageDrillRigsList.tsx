import pureTree from '../../../grids/pureTree'
import * as React from 'react'
import Fab from '../../../controls/Fab'
import {Library} from '../../../styles/SVGLibrary'
import nav from '../../../app/nav'
import PageLayout from '../../../layout/PageLayout'

import {DRILL_RIG} from '@local/biz'
import {makeGrid} from '../../../grids/grid/Grid'
import {gridData} from '../../../grids/grid/gridHelpers'
import {viewGridHeader} from '../../../grids/grid/gridElements'

import {dispatch} from '../../../store/'
import {push} from 'react-router-redux'
import {columnsDrillRigs} from './ColumnsDrillRigs'


const DrillRigGrid = pureTree(DRILL_RIG)
    .of(makeGrid(columnsDrillRigs))
    .contramap(viewGridHeader)
    .connect(gridData(DRILL_RIG))

export default () =>
    <PageLayout>
        <DrillRigGrid
            title='Буровые'
            onRowClick={drillRig =>
                dispatch(push(nav.app.chapterDrillRigs.drillRig.index.get(drillRig)))
            }
        />
        <Fab
            link={nav.app.chapterDrillRigs.createDrillRig.index.path}
        >
            <Library.Add/>
        </Fab>
    </PageLayout>
