import * as React from 'react'
import props from '../smart/props'
import CenteredCaption from '../layout/CenteredCaption'
import makeValue from '../smart/makeValue'
import caseRender from '../smart/caseRender'
import {RawProjectList, RawWellList} from './adminParts'
import {selectors} from '@local/biz'
import {Tab, Tabs} from 'material-ui'


const MaybeWellsList = caseRender(RawWellList)
    .isNilOrEmpty('data', CenteredCaption('Нет добавленных скважин'))

const WellsList = props(MaybeWellsList)
    .connectProp(
        'data',
        selectors.wells.byGroup
    )

const MaybeProjectList = caseRender(RawProjectList)
    .isNilOrEmpty('data', CenteredCaption('Нет добавленных групп'))

const ProjectTree = props(MaybeProjectList)
    .connectProp('data', (props: { groupId: string }) =>
        selectors.projects.byGroup(props.groupId)
    )


const WellsSubList = caseRender(RawWellList)
    .isNilOrEmpty('data', CenteredCaption('Нет доступных скважин'))

const ConnectedWellsSubList = props(WellsSubList)
    .connectProp('data', (props: { groupId: string, projectId: string }) =>
        selectors.wells.byProjectInGroup(props)
    )
    .defaultProp('noDividers', true)

// const WellsInProjectList = props(makeList<WellVO, {})

export default makeValue<string>('one')
    .addProps<{ groupId: string }>()
    .of(({value, groupId, onChange}) =>
        <div>
            <Tabs value={value || 'one'} onChange={(e, v) => onChange(v)}>
                <Tab value='one' label='Скважины'/>
                <Tab value='two' label='Группы'/>
            </Tabs>
            {
                value === 'one'
                    ? <WellsList groupId={groupId} withPagination/>
                    : <ProjectTree
                        groupId={groupId}
                        withPagination
                        expandedRowRender={(project, key) =>
                            <ConnectedWellsSubList
                                projectId={key}
                                groupId={groupId}
                            />
                        }
                    />
            }
        </div>
    )

