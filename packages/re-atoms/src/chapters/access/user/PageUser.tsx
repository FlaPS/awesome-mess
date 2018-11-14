import * as React from 'react'
import {isNil} from 'ramda'
import {actions, GROUP, sel, USER, UserVO} from '@local/biz'
import {FormSection, PageLayout, Paper} from '../../../layout'
import {Library, restyle} from '../../../styles'
import DialogEditFormUC from '../../../smart/form/DialogEditFormUC'
import {dispatch} from '../../../store/'

import PersonDataSection from './PersonDataSection'
import PersonRoleSection from './PersonRoleSection'
import PersonGroupSection from './PersonGroupSection'
import connectProp from '../../../smart/connectProp'
import makeSingularAssignView from '../../makeSingularAssignView'
import {RawUserGroupGrid} from '../../adminParts'
import WellForGroupTabs from '../../WellForGroupTabs'
import Div from '../../../layout/Div'


const GroupEditor = connectProp(
    makeSingularAssignView(RawUserGroupGrid, GROUP),
    'data',
    () => sel(GROUP).asMap()
)

class UserDialogEditor extends DialogEditFormUC<UserVO> {
}

const GridWrap = restyle`
    display: grid;
    grid-gap: 24px;
    grid-template-columns: .54fr .54fr 1fr;
    grid-template-rows: auto 200px;
`(Div)

const ItemOne = restyle`
    grid-area: 1 / 1 / 2 / 3;
`(Div)

const ItemTwo = restyle`
    grid-row: 1 / span 2;
    justify-self: stretch;
    align-self: start;
`(Div)

const UserProfile = ({user}: { user: UserVO }) =>
    <PageLayout gap={24}>
        <GridWrap>
            <ItemOne>
                <DialogEditFormUC
                    stretch
                    model={user}
                    viewer={PersonDataSection}
                    onEdit={user =>
                        dispatch(actions.update(USER, user))
                    }
                />
            </ItemOne>

            <ItemTwo>
                <Paper style={{flexGrow: 1}}>
                    <FormSection
                        fill
                        icon={Library.Well}
                        label={'Доступные скважины'}
                    >
                        <WellForGroupTabs groupId={user.groupId}/>
                    </FormSection>
                </Paper>
            </ItemTwo>

            <UserDialogEditor
                style={{flex: '0 0 50%'}}
                stretch
                model={user}
                withEditButton={!isNil(user.groupId)}
                viewer={({model, toggleEditForm}) => (
                    <PersonGroupSection {...model} onAdd={toggleEditForm}/>
                )}
                editor={props =>
                    <GroupEditor
                        value={[props.model.groupId]}
                        onChange={value => props.onValid({...props.model, groupId: value[0]})}
                    />
                }
                onEdit={user =>
                    dispatch(actions.update(USER, user))
                }
            />

            <UserDialogEditor
                style={{flex: '0 0 50%'}}
                stretch
                model={user}
                viewer={PersonRoleSection}
                onEdit={user =>
                    dispatch(actions.update(USER, user))
                }
            />

        </GridWrap>
    </PageLayout>

const ConnectedProfile = connectProp(UserProfile, 'user', USER.bySpec)

export default ConnectedProfile
