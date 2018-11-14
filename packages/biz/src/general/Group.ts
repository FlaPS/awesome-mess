import {createScheme} from '../core/Scheme'
import {valueTypes} from '../core/valueTypes'
import * as props from '../core/properties'
import {KeyBuilder} from '../core/KeyBuilder'


export const GROUP = createScheme({
    name: 'GROUP',
    keyBuilder: new KeyBuilder().increment('groupId'),

    lang: {
        singular: 'группа пользователей',
        some: 'группы пользователей',
        plural: 'групп пользователей',
        name: 'группы пользователи',
        gender: 'f',
    },
    properties: {
        wellIds: valueTypes.arrayOf({
            schemeName: 'WELL',
        }),
        projectIds: valueTypes.arrayOf({
            schemeName: 'PROJECT',
        }),
        name: props.name,
        creationDate: props.creationDate,
        creatorUserId: props.creatorUserId,
        comment: props.comment,
        excludedWellsInProjects: valueTypes.array<string[]>(),
    },
})

export type GroupSpec = typeof GROUP.spec

export type GroupVO = typeof GROUP.item
