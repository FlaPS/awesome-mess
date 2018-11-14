import {WELL, WellVO} from '../general/Well'
import {GROUP, GroupSpec, GroupVO} from '../general/Group'
import {USER, UserVO} from '../general/User'
import {Dictionary, flatten, omit, uniq} from 'ramda'
import {KeyOrSpec} from '../core'
import {StateWithBiz} from '../BizState'
import {toIndexedArray} from '@local/utils/dist/array'
import {PROJECT} from '../general/Project'

const byProject = WELL.whereProp('projectId')

const byProjectInGroup = WELL.addSelector(
    ({projectId, groupId}: { projectId: string, groupId: string }) => (state): Dictionary<WellVO> => {
        const wells = byProject(projectId)(state)
        const group = GROUP.byKey(groupId)(state)
        const omitedWells = (group.excludedWellsInProjects && group.excludedWellsInProjects[projectId]) || []
        return omit(omitedWells, wells) as Dictionary<WellVO>
    }
)

const byGroup = WELL.addSelector(
    (groupId: KeyOrSpec<GroupSpec>) => (state): Dictionary<WellVO> =>
        WELL.bySpec(GROUP.bySpec(groupId)(state).wellIds)(state)
)


const keysByProjectsInGroup = groupId => state => {
    const group = GROUP.bySpec(groupId)(state) || {} as GroupVO
    const projects = group.projectIds || []

    return uniq(flatten(projects.map(projectId => byProjectInGroup({projectId, groupId}).asKeys(state))))
}

const ownWellsByUser = (key: KeyOrSpec<UserVO>) => state => {
    const user = USER.bySpec(key)(state) || {} as UserVO
    return WELL.bySpec(user.wellIds || [])(state)
}

const allAvailableIdsByUserId = userId => (state: StateWithBiz): string[] => {
    const user = USER.bySpec(userId)(state)

    const group = GROUP.bySpec(user)
    const projects = PROJECT.bySpec(user.projectIds || [])(state)
    const wells = toIndexedArray(state.biz.wellId)
    const ownWells = user.wellIds || []
    const ownProjects = user.projectIds || []
    const ownWellsInProjects = flatten(ownProjects.map(id =>
        byProject(id).asKeys(state)
    )) as any as string[]
    const inGroupWells = byGroup(user.groupId).asKeys(state)
    const inGroupProjectsWells = flatten(keysByProjectsInGroup(user.groupId)(state))

    return uniq(ownWells.concat(ownWellsInProjects, inGroupWells))//inGroupProjectsWells))
}

export default {
    byProject,
    byProjectInGroup,
    byGroup,
    keysByProjectsInGroup,
    ownWellsByUser,
    allAvailableIdsByUserId,
}
