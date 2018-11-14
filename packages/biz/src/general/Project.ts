import {KeyBuilder} from '../core/KeyBuilder'
import {createScheme} from '../core/Scheme'
import {comment, creationDate, creatorUserId, name} from '../core/properties'

//const byGroup = groupId => sel(GROUP).propOf('projectIds')(groupId)

export const PROJECT = createScheme({
    name: 'PROJECT',
    keyBuilder: new KeyBuilder().increment('projectId'),
    lang: {
        singular: 'группа скважин',
        plural: 'групп скважин',
        some: 'группы скважин',
        name: 'группы скважин',
        gender: 'f',
    },
    properties: {
        name,
        creationDate,
        creatorUserId,
        comment,
    },
    /*selectors: {
        byGroup,
        availableForUser: userId => state => {
            const user = sel(USER).byKey(userId)(state)
            return byGroup(user.groupId)(state)
        },
      //  byUser: userId =>
    },*/
})


export type ProjectVO = typeof PROJECT.item

export type ProjectSpec = typeof PROJECT.spec
