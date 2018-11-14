import {Rights} from '@local/biz'
import {AssociativeArray, toAssociativeArray} from '@local/utils'

export type RoleRight = {
    idKey: string
    label: string
    description: string
    value: number
    disabledValues: number[]
}

export const rightLabels = {
    users: 'Управление пользователями',
    wells: 'Управление скважинами',
    refs: 'Управление справочниками',
    reports: 'Управление рапортами',
    motors: 'Управление motors',
    drill: 'Управление буровыми установками',
    survey: 'Управление опросными листами',
}

export const rightStates = ['Просмотр', 'Редактирование', 'Создание']

export const createRoleRights =
    (rights: Rights): AssociativeArray<RoleRight> =>
        toAssociativeArray<RoleRight>('idKey')(createRoleRightsArray(rights))

const createRoleRightsArray =
    (rights: Rights): RoleRight[] =>
        Object
            .keys(rights)
            .map(idKey => createRightObject(idKey, rights[idKey]))

export const createRightObject = (rightName: string, rightValue: number): RoleRight => ({
    idKey: rightName,
    label: rightLabels[rightName],
    description: 'Описание права доступа',
    value: rightValue,
    disabledValues: [],
})
