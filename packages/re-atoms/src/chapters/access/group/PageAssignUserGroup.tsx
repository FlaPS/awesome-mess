import * as React from 'react'
import PageLayout from '../../../layout/PageLayout'
import {columnsUser} from '../ColumnsUser'
import {makeGrid} from '../../../grids/grid/Grid'
import {Title} from '../../../styles/Typography'
import {RouteComponentProps} from 'react-router'
import {FrontState} from '../../../store/index'
import {capitalize} from '@local/utils'
import {HBox} from '../../../layout/Box'
import {Spans} from '../../../layout/Span'
import getFrontendStore, {dispatch} from '../../../store/'
import Button from 'material-ui/Button'
import {replace} from 'react-router-redux'
import nav from '../../../app/nav'
import {actions, GROUP, pluralize, sel, USER, UserVO} from '@local/biz'
import Paper from '../../../layout/Paper'
import {makeSelectionToolbar} from '../../../grids/SmartToolbar'
import {Stateful} from '../../../smart/Stateful'
import pureTree from '../../../grids/pureTree'

const populateUserGroupByUsers = (groupId: string, userIds: string[] = []) =>
    userIds.forEach(
        userId =>
            dispatch(actions.update(USER, userId, {groupId}))
    )

const UsersGrid = makeGrid(columnsUser)
const Toolbar = makeSelectionToolbar<UserVO>()

const UsersContainer = pureTree<UserVO>(USER)
    .ap(props =>
        <Paper>
            <Toolbar {...props}>

                {({value}) =>
                    value && value.length
                        ? `Выбрано ${pluralize(USER)(value.length)}`
                        : 'Пользователи'}

            </Toolbar>
            <UsersGrid {...props} />
        </Paper>
    ).connect((state: FrontState) => ({
            data: USER.whereProp('groupId')(g => !g).asList(state),
        })
    )

export default class extends Stateful<RouteComponentProps<{ groupId: string }>, { userIds: string[] }> {

    onAssign = () => {
        const {groupId} = this.props.match.params
        populateUserGroupByUsers(groupId, this.state.userIds)
        dispatch(replace(nav.app.access.userGroup.index.get({groupId})))
    }

    onCancel = () =>
        dispatch(replace(nav.app.access.userGroups.index.path))


    render() {
        const groupId = this.props.match.params.groupId
        const userGroup = sel(GROUP).byKey(groupId)(getFrontendStore().getState())
        const userIds = this.state.userIds || []

        return (
            <PageLayout>
                <Title>
                    Назначение группы пользователям
                </Title>
                <Spans.Caption2>
                    Выбранные пользователи будут состоять в группе {capitalize(userGroup.name)}
                </Spans.Caption2>

                <UsersContainer
                    mode='multiSelect'
                    idKey='userId'
                    groupId={groupId}
                    value={userIds}
                    onChange={value => this.setState({userIds: value})}
                />

                <HBox reversed>
                    <Button
                        disabled={!this.state.userIds || !this.state.userIds.length}
                        onClick={this.onAssign}
                    >
                        Назначить группу
                    </Button>

                    <Button onClick={this.onCancel}>
                        Отмена
                    </Button>
                </HBox>

            </PageLayout>
        )
    }
}
