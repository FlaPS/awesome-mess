import {KeyBuilder} from '../core/KeyBuilder'
import {createScheme} from '../core/Scheme'
import {isLengthGreaterThan} from '../core/validation'
import {valueTypes} from '../core/valueTypes'
import * as R from 'ramda'
import {compose, head, toUpper} from 'ramda'
import {PROJECT} from './Project'
import {GROUP} from './Group'
import * as props from '../core/properties'


const properties = {
    login: valueTypes.string({
        required: true,
        unique: true,
        rules: [],
    }),
    password: valueTypes.string({
        required: true,
        rules: [
            [isLengthGreaterThan(4), 'Пароль должен включать не менее 4-x символов'],
        ],
    }),
    wellIds: valueTypes.arrayOf({
        schemeName: 'WELL',
    }),
    projectIds: valueTypes.arrayOf({
        schemeName: 'PROJECT',
    }),
    lastName: valueTypes.string({
        required: true,
    }),
    firstName: valueTypes.string({
        required: true,
    }),
    patrName: valueTypes.string(),
    email: valueTypes.string({
        required: true,
    }),
    groupId: valueTypes.itemOf({
        type: 'string',
        schemeName: 'GROUP',
    }),
    roleIds: valueTypes.arrayOf({
        schemeName: 'ROLE',
    }),
    organization: valueTypes.string(),
    position: valueTypes.string(),
    phone: valueTypes.string(),
    creationDate: props.creationDate,
    creatorUserId: props.creatorUserId,
    lastVisitTime: valueTypes.datetime(),
}
const doInitial = compose(
    x => `${x}.`,
    toUpper,
    head
)

export const USER = createScheme({
    name: 'USER',

    keyBuilder: new KeyBuilder().increment('userId'),
    aclKey: 'user',
    lang: {
        singular: 'пользователь',
        some: 'пользователя',
        plural: 'пользователей',
        name: 'пользователи',
        gender: 'm',
    },
    getShortName: user => state =>
        `${user.lastName} ${doInitial(user.firstName)} ${doInitial(user.patrName)}`,

    getFullName: user => state =>
        user.lastName + ' ' +
        user.firstName + ' ' +
        user.patrName + ' ',

    properties,

})

export type UserVO = typeof USER.item

const selectors = {
    byGroupId: groupId =>
        USER.asMap(u =>
            u.groupId === groupId
        ),

    byWellId: wellId => state => {
        const relatedProjects = PROJECT
            .asKeys(p => (p.wellIds || []).includes(wellId))
            (state)

        const relatedGroups = GROUP.asKeys(g =>
            (g.wellIds || []).includes(wellId) ||
            R.intersection(g.projectIds || [], relatedProjects || []).length > 0
        )
        (state)

        return USER.asMap(
            u => relatedGroups.includes(u.groupId)
        )(state)
    },

}

export type UserSpec = typeof USER.spec

