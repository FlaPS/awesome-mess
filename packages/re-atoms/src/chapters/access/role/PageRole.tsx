import * as React from 'react'
import {push} from 'react-router-redux'
import {without} from 'ramda'
import {connect} from 'react-redux'
import styled from 'styled-components'

import nav from '../../../app/nav'
import {actions, pluralize, ROLE, RoleVO, sel, USER, UserVO} from '@local/biz'

import RoutedPage from '../../../smart/RoutedPage'
import {Pure} from '../../../smart/Pure'
import DialogEditForm from '../../../smart/form/DialogEditForm'
import renderChildren, {Renderable} from '../../../smart/renderChildren'

import {FrontState} from '../../../store/index'
import {createRoleRights, rightLabels, rightStates, RoleRight} from '../../../roles/createRoleRights'
import {dispatch} from '../../../store/'

import {makeCrudToolbar} from '../../../grids/SmartToolbar'
import {Column, makeGrid} from '../../../grids/grid/Grid'
import pureTree from '../../../grids/pureTree'
import {TreeMode} from '../../../grids/Expandable'
import {RawUserGrid} from '../../adminParts'
import {PageLayout, Paper, Span, Spans, VBox} from '../../../layout'
import {colors, Library, Typography} from '../../../styles'

import IconButton from 'material-ui/IconButton'
import {AdminItemToolbar, DropDownMenu} from '../../../controls'
import Setup from '../createRole/StepRightsInRole'


const RightsGridHeaderStyle = {
    paddingLeft: '24px',
    boxSizing: 'border-box',
    minHeight: '64px',
}

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const RightsGridHeader =
    (props: { children?: Renderable, toggleEditForm }) =>
        <div>
            <FlexContainer height={64} style={RightsGridHeaderStyle}>
                <Typography.HeadLine>
                    Права доступа
                </Typography.HeadLine>


                <DropDownMenu
                    data={[{
                        renderIcon: () => <Library.Edit/>,
                        renderLabel: () => 'Редактировать',
                        onChange: props.toggleEditForm,
                    }]}
                >
                    <IconButton>
                        <Library.Dots/>
                    </IconButton>
                </DropDownMenu>
            </FlexContainer>
            {renderChildren(props.children, props)}
        </div>

const purgeRoleFromUsers =
    (users: UserVO[]) =>
        (roleId: string) =>
            (userIds: string[]) => {
                userIds
                    .map(id => users.find(user => user.userId === id))
                    .forEach(user => {
                        const roleIds = without(user.roleIds)([roleId])
                        dispatch(actions.update(USER, user.userId, {roleIds}))
                    })
            }


const UsersToolbar = makeCrudToolbar<UserVO>()

const UsersContainer = pureTree<UserVO, { roleId: string }>(USER)
    .connect((state, {roleId}) => ({
        data: sel(USER).asList()(state).filter(vo => vo.roleIds.includes(roleId)),
    }))
    .ap(props =>
        <Paper>
            <UsersToolbar
                {...props}
                onSelectionCancel={() => props.onModeChange(TreeMode.VIEW)}
                onSelectionSubmit={userIds => {
                    purgeRoleFromUsers(props.data)(props.roleId)(userIds)
                    props.onModeChange(TreeMode.VIEW)
                }}
                onRequestAdd={() =>
                    dispatch(push(nav.app.access.assignRole.index.get({roleId: props.roleId})))
                }
            >
                {props.mode !== TreeMode.VIEW
                    ? `Выбрано ${pluralize(USER)(props.value && props.value.length)}`
                    : 'Пользователи'
                }
            </UsersToolbar>

            <RawUserGrid
                isSelectionDisabled={user => user.roleIds.length === 1}
                selectionDisableReason='У пользователя в системе должна быть как минимум одна роль'
                idKey={'userId'}
                {...props}
            />
        </Paper>
    )

const Item = styled(Span)`
    display: inline-block;
    max-width: 140px;
    width: 100%;
    text-align: center
`

const Circle = styled(Span)`
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;

    &.active {
        background-color: ${colors.LIGHT_GREEN};
    }

    &.disabled {
        background-color: ${colors.GRAY};
    }
`

const IconChecked = props =>
    <Circle className='active'>
        <Library.Done fill={colors.GREEN}/>
    </Circle>

const IconUnChecked = props =>
    <Circle className='disabled'>
        <Library.CloseCross fill={colors.WHITE}/>
    </Circle>


const renderIcon =
    (value: number, record: RoleRight) =>
        (position: number) =>
            position > value || record.disabledValues.includes(position)
                ? <IconUnChecked/>
                : <IconChecked/>

const columnsRights: Column<RoleRight>[] = [
    {
        title: 'Основные функции системы',
        dataIndex: 'label',
    },
    {
        title: 'value',
        dataIndex: 'value',
        renderHeader: () => rightStates.map((state, i) => <Item key={i}>{state}</Item>),
        render: (value, record) =>
            rightStates
                .map((_, i) => i + 1)
                .map(renderIcon(value, record))
                .map((icon, i) => <Item key={i}>{icon}</Item>),
    },
]

const SetupGrid = Pure()
    .of(makeGrid(columnsRights))
    .contramap(RightsGridHeader)

const getRights = model => {
    const rights = Object.keys(rightLabels)
        .reduce((acc, key) => ({...acc, [key]: 0}), {})

    return {...rights, ...model.rights, ...model.reportRights}
}

const RightsViewer = ({model, toggleEditForm}) => (
    <div style={{marginBottom: 25}}>
        <SetupGrid
            columns={columnsRights}
            withPagination={false}
            data={createRoleRights(getRights(model))}
            idKey={'idKey'}
            hover={false}
            isSortable={false}
            toggleEditForm={toggleEditForm}
        />
    </div>
)

const updateRoleRights =
    ({roleId, rights, reportRights}: RoleVO) =>
        dispatch(actions.update(ROLE, roleId, {rights, reportRights}))

const Toolbar = AdminItemToolbar(ROLE)

const EditorContramap = ({children, ...props}) =>
    <VBox width={1232}>
        {renderChildren(children, props)}
    </VBox>

const RoleProfile = connect(
    (state: FrontState, props: { roleId: string }): { role: RoleVO } => ({
        role: sel(ROLE).byKey(props.roleId)(state),
    })
)(({role, users, dispatch}) => (
    <PageLayout>
        <Toolbar id={role.roleId}/>
        <DialogEditForm
            model={role || {}}
            viewer={RightsViewer}
            editor={Setup.contramap(EditorContramap)}
            onEdit={updateRoleRights}
        />
        <Spans.Caption style={{marginBottom: 4}}>
            Пользователи, которым назначена эта роль
        </Spans.Caption>

        <UsersContainer noun={USER.lang.some} roleId={role.roleId}/>
    </PageLayout>
))

export default class extends RoutedPage<{ roleId: string }, void> {
    render() {
        return <RoleProfile roleId={this.getParams().roleId}/>
    }
}
