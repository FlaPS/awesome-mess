import {ROLE, RoleSpec} from '../general/Role'
import {ProjectSpec} from '../general/Project'
import * as R from 'ramda'
import {KeyOrSpec} from '../core/Scheme'
import {USER} from '../general/User'
import groups from './group'
import {WellSpec} from '../general/Well'

const byGroup = USER.whereProp('groupId')

const byProject = USER.addSelector(
    (keyOrSpec: KeyOrSpec<ProjectSpec>) => state =>
        R.chain(byGroup, groups.byProject(keyOrSpec).asKeys)(state)
)

export const byRole = (keyOrSpec: KeyOrSpec<RoleSpec>) =>
    USER.where({
        roleId: R.contains(ROLE.keyBuilder.buildKey(keyOrSpec)),
    })

export const byWell = USER.addSelector(
    (keyOrSpec: KeyOrSpec<WellSpec>) => state =>
        R.chain(byGroup, groups.byWell(keyOrSpec).asKeys)(state)
)

// byWell('3').asList()
export default {
    byGroup,
    byRole,
    byProject,
    byWell,
}

