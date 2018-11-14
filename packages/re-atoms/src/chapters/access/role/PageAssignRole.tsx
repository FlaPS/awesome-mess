import * as React from 'react'
import {FrontState} from '../../../store/index'
import getFrontendStore, {dispatch} from '../../../store/'
import {replace} from 'react-router-redux'
import nav from '../../../app/nav'
import {actions, ROLE, schemeLens, sel, USER} from '@local/biz'
import makeAssignDataView from '../../makeMultipleAssignView'
import {RawUserGrid} from '../../adminParts'
import props from '../../../smart/props'
import RoutedPage from '../../../smart/RoutedPage'

const populateRoleToUsers = (roleId: string, state: FrontState, userIds: string[] = []) =>
    userIds.forEach(
        userId => {
            const user = schemeLens(USER).get(state)[userId]
            const patch = {roleIds: user.roleIds ? user.roleIds.concat([roleId]) : [roleId]}
            dispatch(actions.update(USER, userId, patch))
        }
    )

const UsersContainer = props(makeAssignDataView(RawUserGrid, USER))
    .connectProp('data', (props: { roleId: string }) =>
        USER.asList(u => !u.roleIds || !u.roleIds.includes(props.roleId))
    )


export default class extends RoutedPage<{ roleId: string }, any> {

    onAssign = (ids: string[]) => {
        const {roleId} = this.getParams()
        populateRoleToUsers(roleId, getFrontendStore().getState(), ids)
        dispatch(replace(nav.app.access.role.index.get({roleId})))
    }

    onCancel = () =>
        dispatch(replace(nav.app.access.role.index.get(this.getParams())))


    render() {
        const roleId = this.props.match.params.roleId
        const role = sel(ROLE).byKey(roleId)()


        return <UsersContainer
            roleId={roleId}
            title={'Пользователи'}
            okText={'Назначить роль'}
            cancelText={'Отмена'}
            caption={'Выбранным пользтователям будет назначена группа ' + role.name}
            onOk={this.onAssign}
            onCancel={this.onCancel}
        />
    }
}
