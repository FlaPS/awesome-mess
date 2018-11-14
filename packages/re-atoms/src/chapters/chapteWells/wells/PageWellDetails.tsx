import * as React from 'react'
import {connect} from 'react-redux'
import {isNil} from 'ramda'
import {actions, PROJECT, selectors, WELL, WELL_FIELD, WELL_PLACE, WellVO} from '@local/biz'
import RoutedPage from '../../../smart/RoutedPage'
import {FormSection, HBox, PageLayout, Paper, VBox} from '../../../layout'
import {FrontState} from '../../../store/index'

import DialogEditFormUC from '../../../smart/form/DialogEditFormUC'
import {dispatch} from '../../../store/'
import WellDataSection from './WellDataSection'
import WellGroupSection from './WellGroupSection'
import {Library} from '../../../styles'
import AdminItemToolbar from '../../../controls/AdminItemToolbar'
import connectProp from '../../../smart/connectProp'
import {RawProjectGrid, RawUserList} from '../../adminParts'
import makeSingularAssignView from '../../makeSingularAssignView'

const Toolbar = AdminItemToolbar(WELL)

const ProjectEditor = connectProp(
    makeSingularAssignView(RawProjectGrid, PROJECT),
    'data',
    props => PROJECT.asMap()
)

class UserDialogEditor extends DialogEditFormUC<WellVO> {
}

const ConnectedUsers = connectProp(RawUserList, 'data', (props: { wellId: string }) =>
    selectors.users.byWell(props)
)
/*
const ConnectedUserGroups = connectProp(RawUserList, 'data', (props: {wellId: string}) =>
    selectors.groups.byProject(props)
)*/

const WellProfile = connect(
    (state: FrontState, props: { wellId: string }) => ({
        well: WELL.byKey(props.wellId)(state),
        wellField: WELL_FIELD.asMap()(state),
        wellPlace: WELL_PLACE.asMap()(state),
        project: PROJECT.asList()(state),
    })
)(({wellField, wellPlace, well}) =>
    <PageLayout>
        <Toolbar id={well.wellId} removeIsHidden={true}/>
        <HBox gap={24} style={{alignItems: 'stretch'}}>
            <DialogEditFormUC
                stretch
                model={well}
                viewer={WellDataSection}
                onEdit={well => dispatch(actions.update(WELL, well))}
            />
            <VBox stretch gap={24}>
                <UserDialogEditor
                    stretch
                    model={well}
                    withEditButton={!isNil(well.projectId)}
                    viewer={({model, toggleEditForm}) => (
                        <WellGroupSection {...model} onAdd={toggleEditForm}/>
                    )}
                    editor={props =>
                        <ProjectEditor
                            value={[props.model.projectId]}
                            onChange={value => props.onValid({...props.model, projectId: value[0]})}
                        />
                    }
                    onEdit={well =>
                        dispatch(actions.update(WELL, well))
                    }
                />

                <Paper>
                    <FormSection
                        fill
                        icon={Library.Visible}
                        label={'Пользователи и группы пользователей, которые имеют доступ к скважине'}
                    >
                        <ConnectedUsers
                            height={494}
                            wellId={well.wellId}
                            withPagination={false}
                        />
                    </FormSection>
                </Paper>
            </VBox>
        </HBox>
    </PageLayout>
)

export default class extends RoutedPage<{ wellId: string }, void> {
    render() {
        return <WellProfile wellId={this.getParams().wellId}/>
    }
}

