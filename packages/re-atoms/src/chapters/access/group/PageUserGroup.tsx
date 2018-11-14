import * as React from 'react'
import RoutedPage from '../../../smart/RoutedPage'
import PageLayout from '../../../layout/PageLayout'
import {VBox} from '../../../layout/Box'
import AdminItemToolbar from '../../../controls/AdminItemToolbar'
import {actions, GROUP, GroupVO, sel, USER} from '@local/biz'
import {Spans} from '../../../layout/Span'
import UsersInGroup from './UsersInGroup'
import WellForGroupTabs from '../../WellForGroupTabs'
import Paper from '../../../layout/Paper'
import {dispatch} from '../../../store/'
import {formPure} from '../../../smart/Form'
import DialogEditFormUC from '../../../smart/form/DialogEditFormUC'
import StepUserGroupWells from '../createUserGroup/StepUserGroupWells'

const Toolbar = AdminItemToolbar(GROUP)

const WellsCard = formPure<GroupVO>(GROUP, ['wellIds', 'projectIds', 'excludedWellsInProjects'])
    .ap(props =>
        <DialogEditFormUC
            stretch
            model={props.model}
            editor={StepUserGroupWells}
            viewer={<WellForGroupTabs groupId={props.groupId}/>}
            onEdit={group => dispatch(actions.update(GROUP, props.groupId, group))}
        />
    )
    .connect((state, props: { groupId: string }) => ({
        model: sel(GROUP).byKey(props.groupId)(state)
    }))
//const WellsAndProjectsCard =

const PageUserGroup = ({groupId, ...props}) =>
    <PageLayout>
        <VBox gap={16}>
            <Toolbar id={groupId}/>
            <UsersInGroup noun={USER.lang.some} groupId={groupId}/>

            <Spans.Caption style={{marginBottom: 4}}>
                Скважины, которые доступны этой группе пользователей
            </Spans.Caption>
            <Paper>
                <WellsCard groupId={groupId}/>
            </Paper>
        </VBox>
    </PageLayout>


export default class extends RoutedPage<{ groupId: string }, void> {
    render() {
        return <PageUserGroup groupId={this.getParams().groupId}/>
    }
}
