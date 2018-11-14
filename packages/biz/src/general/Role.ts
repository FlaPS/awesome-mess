import {createScheme} from '../core/Scheme'
import {valueTypes} from '../core/valueTypes'
import {color, comment, creationDate, creatorUserId, name} from '../core/properties'
import {KeyBuilder} from '../core/KeyBuilder'

export type Rights = {
    user?: number
    well?: number
    ref?: number
    report?: number
    motor?: number
}

export type ReportRights = {
    drill?: number
    survey?: number
}

export const ROLE = createScheme({
    name: 'ROLE',
    keyBuilder: new KeyBuilder().increment('roleId'),
    lang: {
        singular: 'роль',
        some: 'роли',
        plural: 'ролей',
        name: 'роли',
        gender: 'f',
    },
    properties: {
        name,
        creationDate,
        creatorUserId,
        color,
        comment,
        rights: valueTypes.item<Rights>(),
        reportRights: valueTypes.item<ReportRights>(),
    },
})

export type RoleVO = typeof ROLE.item

export type RoleSpec = typeof ROLE.spec
