import * as R from 'ramda'
import {GROUP, GroupSpec} from '../general/Group'
import {KeyOrSpec} from '../core/Scheme'
import {PROJECT} from '../general/Project'
import {USER, UserSpec, UserVO} from '../'

const byGroup = PROJECT.addSelector(
    (key: KeyOrSpec<GroupSpec>) => state =>
        PROJECT.bySpec(GROUP.bySpec(key)(state).projectIds)(state)
)

const byUser = PROJECT.addSelector(
    (key: KeyOrSpec<UserSpec>) => state => {
        const user = USER.bySpec(key)(state) || {} as UserVO

        const ownProjects = user.projectIds || []

        const groupProjects = user.groupId
            ? GROUP.bySpec(user.groupId)(state).projectIds || []
            : []

        const allProjects = R.uniq(ownProjects.concat(groupProjects))
        return R.pick(allProjects, PROJECT.asMap()(state))
    }
)


export default {
    byGroup,
    byUser,
}
