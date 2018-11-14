import * as React from 'react'
import {ChapterAccess} from './ChapterAccess'
import PageUser from './user/PageUser'
import RolesListPage from './PageRolesList'
import PageUserGroup from './group/PageUserGroup'
import PageAssignWell from './PageAssignWell'
import UsersListPage from './PageUsersList'
import CreateRoleWizard from './createRole/WizardRole'
import PageRole from './role/PageRole'
import UsersGroupsListPage from './PageGroupList'
import PageAssignRole from './role/PageAssignRole'
import WizardUserGroup from './createUserGroup/WizardUserGroup'
import CreateUserWizard from './createUser/WizardUser'
import PageAssignUserGroup from './group/PageAssignUserGroup'
import {ROLE, USER} from '@local/biz'
import Library from '../../styles/SVGLibrary'


const users = {
    index: {
        path: '/app/access/users',
        title: 'Пользователи',
        label: 'Пользователи',
        component: UsersListPage,
    },
}


const user = {
    index: {
        path: '/app/access/createUser/:userId',
        get: value => '/app/access/createUser/' + value.userId,
        title: user =>
            USER.getShortName(USER.bySpec(user)())(),
        component: PageUser,
    },
}

const addUser = {
    index: {
        path: '/app/access/addUser',
        title: 'Новый пользователь',
        component: CreateUserWizard,
    },
}
const createRole = {
    index: {
        path: '/app/access/createRole',
        title: 'Новая роль',
        component: CreateRoleWizard,
    },
}

const assignRole = {
    index: {
        path: '/app/access/assignRole/:roleId',
        get: value => '/app/access/assignRole/' + value.roleId,
        title: 'Нозначение роли',
        component: PageAssignRole,
    },
}

const roles = {
    index: {
        path: '/app/access/roles',
        title: 'Роли',
        label: 'Роли',
        component: RolesListPage,
    },
}

const userGroups = {
    index: {
        path: '/app/access/userGroups',
        title: 'Группы пользователей',
        label: 'группы',
        component: UsersGroupsListPage,
    },
}

const userGroup = {
    index: {
        path: '/app/access/group/:groupId',
        get: value => '/app/access/group/' + value.groupId,
        title: 'Группы пользователей',
        component: PageUserGroup,
    },
}

const assignUserGroup = {
    index: {
        path: '/app/access/assignUserGroup/:groupId',
        get: value => '/app/access/assignUserGroup/' + value.groupId,
        title: 'Назначение группы пользователей',
        component: PageAssignUserGroup,
    },
}

const role = {
    index: {
        path: '/app/access/role/:roleId',
        get: value => '/app/access/role/' + value.roleId,
        title: ({roleId}) => {
            const role = ROLE.byKey(roleId)()
            return `Роль '${role.name}'`
        },
        component: PageRole,
    },
}

const addUserGroup = {
    index: {
        path: '/app/access/addUserGroup',
        title: 'Новая группа пользователей',
        component: WizardUserGroup,
    },
}

const assignWell = {
    index: {
        path: '/app/access/assignWell/:groupId',
        get: value => '/app/access/assignWell/' + value.groupId,
        title: 'Добавление скважин в группу пользователей',
        component: PageAssignWell,
    },
}


export default {
    index: {
        component: ChapterAccess,
        path: '/app/access',
        innerIndex: '/app/access/users',
        icon: <Library.User/>,
        label: 'Пользователи',
        redirect: '/app/access/users',
        title: 'Управление пользователями',
    },
    users,
    userGroups,
    roles,
    user,
    addUser,
    userGroup,
    addUserGroup,
    assignUserGroup,

    role,
    createRole,
    assignRole,

    assignWell,
}
