import props from '../../../smart/props'
import * as React from 'react'
import Fab from '../../../controls/Fab'
import {Library} from '../../../styles/SVGLibrary'
import nav from '../../../app/nav'
import {PROJECT} from '@local/biz'
import {viewGridHeader} from '../../../grids/grid/gridElements'

import {dispatch} from '../../../store/'
import {push} from 'react-router-redux'
import pureGrid from '../../../grids/grid/pureGrid'


const projectsGrid = pureGrid(PROJECT, [
    'name',
    'creatorUserId',
    'creationDate',
    'comment']
)
    .contramap(viewGridHeader)

const ConnectedGrid = props(projectsGrid)
    .connectProp('data', PROJECT.asMap)

export default () =>
    <div>
        <ConnectedGrid
            title={'Группы скважин'}
            onRowClick={project =>
                dispatch(push(nav.app.chapterWells.project.index.get(project)))
            }
        />
        <Fab
            link={nav.app.chapterWells.addWellProject.index.path}
        >
            <Library.Add/>
        </Fab>
    </div>
