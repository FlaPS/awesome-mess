import * as React from 'react'
import {formPure} from '../../../smart/Form'
import Paper from '../../../layout/Paper'
import {HBox, VBox} from '../../../layout/Box'

import {GROUP, pluralize, PROJECT, ProjectVO, sel, WELL, WellVO} from '@local/biz'

import {makeList} from '../../../grids/list/List'
import {connect} from 'react-redux'
import {FrontState} from '../../../store/index'
import {AssociativeArray} from '@local/utils'
import {isEmpty} from 'ramda'
import CenteredCaption from '../../../layout/CenteredCaption'
import caseRender from '../../../smart/caseRender'
import {DivProps} from '../../../layout/Div'
import GridToolbar from '../../../grids/SmartToolbar'
import {ExpandedRowRenderer} from '../../../grids/Expandable'
import styled from 'styled-components'
import {messageFactory} from '../../../smart/Pure'
import {Tab, Tabs} from 'material-ui'
import {Spans} from '../../../layout/Span'

const VDivider = styled.div`
    width: 1px;
    opacity: 0.38;
    background-color: #BDBDBD;
`

const WellsRaw = makeList(WELL)

const WellsList = caseRender(WellsRaw)

const WellsInGroupList = WellsList.isNilOrEmpty(
    'data',
    CenteredCaption('В проекте нет скважин')
)


const AllWellsList = WellsList.isNilOrEmpty(
    'data',
    CenteredCaption('Нет скважин вне проектов')
)

const SelectedWellsList = WellsList.isNilOrEmpty(
    'data',
    CenteredCaption('Не выбрано ни одной скважины')
)

const wellsTabMapStateToProps = (state: FrontState) => ({
    wells: sel(WELL).asList()(state) as WellVO[],
})

type WellsTabProps = {
    wellIds: string[]
    wells: WellVO[]
    onChange: (value: string[]) => any
} & DivProps

const WellsTabComponent = ({wellIds, wells, onChange, ...props}: WellsTabProps) => {
    const text = wellIds.length === 0
        ? pluralize(WELL)(wells.length)
        : `Выбрано ${pluralize(WELL)(wellIds.length)} из ${wells.length}`

    return (
        <VBox {...props}>
            <GridToolbar active={wellIds.length > 0} bottomBorder topBorder>
                {text}
            </GridToolbar>

            <HBox>
                <AllWellsList
                    height={'auto'}
                    width={414}
                    mode='multiSelect'
                    data={wells.filter(w => !wellIds.includes(w.wellId))}
                    render={sel(WELL).getFullName}
                    value={[]}
                    onChange={value =>
                        onChange([...wellIds, ...value])
                    }
                />
                <VDivider/>
                <SelectedWellsList
                    height={'auto'}
                    width={414}
                    mode='multiSelect'
                    data={wells.filter(w => wellIds.includes(w.wellId))}
                    render={sel(WELL).getFullName}
                    value={wellIds}
                    onChange={onChange}
                />
            </HBox>
        </VBox>
    )
}

const WellsTab = connect(wellsTabMapStateToProps)(WellsTabComponent)


const ProjectsList = caseRender(
    makeList<ProjectVO, { wells: WellVO[] }>(PROJECT)
)

const AllProjectsList = ProjectsList.match(
    props => isEmpty(props.data),
    CenteredCaption('Нет доступных групп')
)

const SelectedProjectsList = ProjectsList.match(
    props => isEmpty(props.data),
    CenteredCaption('Не выбрано ни одной группы')
)

const projectsTabMapStateToProps = (state: FrontState) => ({
    wells: sel(WELL).asList()(state).filter(w => w.projectId !== undefined) as WellVO[],
    projects: sel(PROJECT).asList()(state) as ProjectVO[],
})

type ProjectsTabProps = {
    projectIds: string[]
    excludedWellsInProjects: AssociativeArray<string[]>
    projects: ProjectVO[]
    wells: WellVO[]
    onChangeExclusion: (value: AssociativeArray<string[]>) => void
    onChange: (value: string[]) => void
} & DivProps

const pluralizeWell = (value: { projectId: string }, props: { wells: WellVO[] }) =>
    pluralize(WELL)((props.wells as WellVO[]).filter(w => w.projectId === value.projectId).length)

const renderProjectsItem =
    (value: ProjectVO, list: { props: { wells: WellVO[] } }) => (
        <div style={{width: '100%'}}>
            {value.name}
            <Spans.Caption style={{float: 'right'}}>
                {pluralizeWell(value, list.props)}
            </Spans.Caption>
        </div>
    )

const expandedAllProjectsItem =
    (v, owner): ExpandedRowRenderer<ProjectVO, { wells: WellVO[] }> => (
        <WellsInGroupList
            noDividers
            mode=''
            render={sel(WELL).getFullName}
            data={owner.props.wells.filter(w => w.projectId === v.projectId)}
        />
    ) as any as ExpandedRowRenderer<ProjectVO, { wells: WellVO[] }>

const expandedSelectedProjectsItem =
    (
        excludedWellsInProjects,
        onChangeExclusion
    ): ExpandedRowRenderer<ProjectVO, { wells: WellVO[] }> =>
        (v, owner) => {
            const wells = owner.props.wells.filter(w => w.projectId === v.projectId)
            const excluded = excludedWellsInProjects[v.projectId] || []

            return (
                <WellsInGroupList
                    noDividers
                    mode='multiSelect'
                    data={wells}
                    inversedSelection
                    value={excluded}
                    render={sel(WELL).getFullName}
                    onChange={value => onChangeExclusion({[v.projectId]: value})}
                />
            )
        }

const ProjectsTabComponent =
    ({
         projects,
         wells,
         projectIds,
         excludedWellsInProjects,
         onChange,
         onChangeExclusion,
         ...props,
     }: ProjectsTabProps) => {
        const text = projectIds.length === 0
            ? pluralize(PROJECT)(projects.length)
            : `Выбрано ${pluralize(PROJECT)(projectIds.length)} из ${projects.length}`


        return (
            <VBox {...props}>
                <GridToolbar active={projectIds.length > 0} bottomBorder topBorder>
                    {text}
                </GridToolbar>

                <HBox>
                    <AllProjectsList
                        expandedRowRender={expandedAllProjectsItem}
                        height={'auto'}
                        wells={wells}
                        width={414}
                        mode='multiSelect'
                        data={projects.filter(w => !projectIds.includes(w.projectId))}
                        value={[]}
                        render={renderProjectsItem}
                        onChange={value => onChange([...projectIds, ...value])}
                    />
                    <VDivider/>
                    <SelectedProjectsList
                        expandedRowRender={
                            expandedSelectedProjectsItem(
                                excludedWellsInProjects,
                                onChangeExclusion
                            )
                        }
                        height={'auto'}
                        wells={wells}
                        width={414}
                        mode='multiSelect'
                        data={projects.filter(w => projectIds.includes(w.projectId))}
                        value={projectIds}
                        render={renderProjectsItem}
                        onChange={onChange}
                    />

                </HBox>
            </VBox>
        )
    }

const ProjectsTab = connect(projectsTabMapStateToProps)(ProjectsTabComponent)


const TabActions = {
    onTabChange: messageFactory<string>('onTabChange'),
}


const tabsReducer = (state: { activeTab: string }, action) =>
    action.type === 'onTabChange'
        ? {...state, activeTab: action.payload}
        : state

export default formPure(GROUP, ['wellIds', 'projectIds', 'excludedWellsInProjects'])
    .addMsg(TabActions)
    .addReducer(tabsReducer)
    .ap(props => {
        const changeExclusion = (value: AssociativeArray<string[]>) =>
            props.onChange({
                property: 'excludedWellsInProjects',
                value: {...props.model.excludedWellsInProjects, ...value},
            })

        return (
            <div>
                <Paper style={{padding: '0px', width: '829px', height: '507px', marginBottom: '16px'}}>
                    <VBox>
                        <Tabs value={props.activeTab || 'one'} onChange={(e, v) => props.onTabChange(v)}>
                            <Tab value='one' label='Скважины'/>
                            <Tab value='two' label='Проекты'/>
                        </Tabs>
                        <div style={{width: '100%', height: '459px'}}>
                            {
                                (props.activeTab === 'one' || !props.activeTab) &&
                                <WellsTab
                                    style={{maxHeight: '100%', height: 'auto'}}
                                    wellIds={props.model.wellIds}
                                    onChange={value => props.onChange({property: 'wellIds', value})}
                                />
                            }
                            {
                                props.activeTab === 'two' &&
                                <ProjectsTab
                                    onChangeExclusion={changeExclusion}
                                    style={{maxHeight: '100%', height: 'auto'}}
                                    projectIds={props.model.projectIds}
                                    excludedWellsInProjects={props.model.excludedWellsInProjects}
                                    onChange={value => props.onChange({property: 'projectIds', value})}
                                />
                            }
                        </div>
                    </VBox>
                </Paper>
            </div>
        )
    })
