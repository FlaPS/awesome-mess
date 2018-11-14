import * as React from 'react'
import PageLayout from '../../layout/PageLayout'
import {Title} from '../../styles/Typography'
import {RouteComponentProps} from 'react-router'
import {FrontState} from '../../store/index'
import {HBox} from '../../layout/Box'
import {Spans} from '../../layout/Span'
import getFrontendStore, {dispatch} from '../../store/'
import Button from 'material-ui/Button'
import {replace} from 'react-router-redux'
import nav from '../../app/nav'
import {actions, GROUP, GroupVO, pluralize, sel, WELL, WellVO} from '@local/biz'
import Paper from '../../layout/Paper'
import {makeSelectionToolbar} from '../../grids/SmartToolbar'
import {Stateful} from '../../smart/Stateful'
import pureTree from '../../grids/pureTree'
import {RawWellGrid} from '../adminParts'

const populateWellsToUserGroup = (groupId: string, state: FrontState, addedWellIds: string[] = []) => {
    const userGroup = sel(GROUP).byKey(groupId)(state)
    const wellIds = [...userGroup.wellIds, ...addedWellIds]

    dispatch(actions.update(GROUP, groupId, {wellIds}))
}


const Toolbar = makeSelectionToolbar<WellVO>()

const WellsContainer = pureTree<WellVO, { userGroup: GroupVO }>(WELL)
    .ap(props =>
        <Paper>
            <Toolbar {...props}>

                {({value}) =>
                    value && value.length
                        ? `Выбрано ${pluralize(WELL)(value.length)}`
                        : WELL.lang.name}

            </Toolbar>
            <RawWellGrid {...props} />

        </Paper>
    ).connect((state: FrontState, {userGroup}) => ({
        data: sel(WELL).asList()(state).filter(w => !userGroup.wellIds.includes(w.wellId)),
    }))


export default class extends Stateful<RouteComponentProps<{ groupId: string }>, { wellIds: string[] }> {

    onAssign = () => {
        const {groupId} = this.props.match.params
        populateWellsToUserGroup(groupId, getFrontendStore().getState(), this.state.wellIds)
        dispatch(replace(nav.app.access.userGroup.index.get({groupId})))
    }

    onCancel = () =>
        dispatch(replace(nav.app.access.userGroups.index.path))


    render() {
        const groupId = this.props.match.params.groupId
        const userGroup = GROUP.byKey(groupId)(getFrontendStore().getState())
        const wellIds = this.state.wellIds || []

        return (
            <PageLayout>
                <Title>
                    Добавление скважины
                </Title>
                <Spans.Caption2>
                    Выбранные скважины будут доступные гурппе пользователей "{userGroup.name}"
                </Spans.Caption2>

                <WellsContainer
                    mode='multiSelect'
                    idKey='wellId'
                    userGroup={userGroup}
                    value={wellIds}
                    onChange={value => this.setState({wellIds: value})}
                />

                <HBox reversed>
                    <Button
                        disabled={!this.state.wellIds || !this.state.wellIds.length}
                        onClick={this.onAssign}
                    >
                        Добавить скважины
                    </Button>

                    <Button onClick={this.onCancel}>
                        Отмена
                    </Button>
                </HBox>

            </PageLayout>
        )
    }
}
