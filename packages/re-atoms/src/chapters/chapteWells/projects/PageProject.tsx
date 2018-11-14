import * as React from 'react'
import RoutedPage from '../../../smart/RoutedPage'
import {PageLayout} from '../../../layout/index'
import {actions, PROJECT, sel, WELL, WellVO} from '@local/biz'
import props from '../../../smart/props'
import {RawWellGrid} from '../../adminParts'
import pureTree from '../../../grids/pureTree'
import {makeCrudToolbar} from '../../../grids/SmartToolbar'
import Paper from '../../../layout/Paper'
import {dispatch} from '../../../store/'
import {push} from 'react-router-redux'
import nav from '../../../app/nav'
import {TreeMode} from '../../../grids/Expandable'
import * as R from 'ramda'
import caseRender from '../../../smart/caseRender'
import CenteredCaption from '../../../layout/CenteredCaption'
import AdminItemToolbar from '../../../controls/AdminItemToolbar'

const GridToolbar = makeCrudToolbar<WellVO>()

const purgeWellsFromProject = (projectId: string, wellIds: string[]) => {
    const prevIds = sel(WELL).asKeys(w => w.projectId === projectId)()
    const idsToDelete = R.intersection(prevIds, wellIds)

    dispatch(actions.populate(WELL, {projectId: null}, idsToDelete))
}


const MaybeWellGrid = caseRender(RawWellGrid)
    .isNilOrEmpty('data',
        CenteredCaption('В проекте нет ни одной скважины'))

const WellsCard = pureTree<WellVO>(WELL)
    .ap(props =>
        <Paper>
            <GridToolbar

                {...props}
                title={'Скважины'}
                onSelectionCancel={() => props.onModeChange(TreeMode.VIEW)}
                onSelectionSubmit={wellIds => {
                    purgeWellsFromProject(props.projectId, wellIds)
                    props.onModeChange(TreeMode.VIEW)
                }}
            />
            <MaybeWellGrid {...props} idKey={'wellId'}/>
        </Paper>
    )

const ConnectedWellsCard = props(WellsCard)
    .connectProp('data', (props: { projectId: string }) =>
        WELL.asList(w => w.projectId === props.projectId)
    )

const Toolbar = AdminItemToolbar(PROJECT)

export default class extends RoutedPage<{ projectId: string }, void> {
    onAdd = () =>
        dispatch(push(
            nav
                .app
                .chapterWells
                .assignProject
                .index.get(this.getParams())
        ))

    render() {
        const {projectId} = this.getParams()
        return <PageLayout>
            <Toolbar id={projectId}/>
            <ConnectedWellsCard
                projectId={projectId}
                onRequestAdd={this.onAdd}
            />
        </PageLayout>
    }
}