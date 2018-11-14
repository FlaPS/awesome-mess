import * as React from 'react'
import {Stateful} from '../../../smart/Stateful'
import {RouteComponentProps} from 'react-router'
import {replace} from 'react-router-redux'
import {Spans} from '../../../layout/Span'
import nav from '../../../app/nav'
import getFrontendStore, {dispatch} from '../../../store/'
import PageLayout from '../../../layout/PageLayout'
import {Title} from '../../../styles/Typography'
import {actions, pluralize, PROJECT, sel, WELL, WellVO} from '@local/biz'
import {FrontState} from '../../../store/index'
import {HBox} from '../../../layout/Box'
import {Button} from '../../../controls/index'
import {makeSelectionToolbar} from '../../../grids/SmartToolbar'
import {Paper} from '../../../layout/index'
import pureTree from '../../../grids/pureTree'
import {RawWellGrid} from '../../adminParts'


const Toolbar = makeSelectionToolbar<WellVO>()

const WellsContainer = pureTree<WellVO>(WELL)
    .ap(props =>
        <Paper>
            <Toolbar {...props}>

                {({value}) =>
                    value && value.length
                        ? `Выбрано ${pluralize(WELL)(value.length)}`
                        : 'Скважины'}

            </Toolbar>
            <RawWellGrid {...props} />
        </Paper>
    )
    .connect((state: FrontState, props: { projectId: string }) => {
        return {
            data: WELL.asList(u => u.projectId !== props.projectId)(state)
        }
    })

const populate = (projectId: string, state: FrontState, wellIds: string[] = []) =>
    dispatch(actions.populate(WELL, {projectId}, wellIds))


export default class extends Stateful<RouteComponentProps<{ projectId: string }>, { wellIds: string[] }> {

    onAssign = () => {
        const {projectId} = this.props.match.params
        populate(projectId, getFrontendStore().getState(), this.state.wellIds)
        dispatch(replace(nav.app.chapterWells.project.index.get({projectId})))
    }

    onCancel = () =>
        dispatch(replace(nav.app.chapterWells.projects.index.path))


    render() {
        const projectId = this.props.match.params.projectId
        const project = sel(PROJECT).byKey(projectId)(getFrontendStore().getState())
        const wellIds = this.state.wellIds || []

        return (
            <PageLayout>
                <Title>
                    Назначение группы скавжин
                </Title>
                <br/>
                <Spans.Caption2>
                    Выбранным скважинам будет назначена группа {project.name}
                </Spans.Caption2>

                <WellsContainer
                    mode='multiSelect'
                    projectId={projectId}
                    idKey={'wellId'}
                    value={wellIds}
                    onChange={value => this.setState({wellIds: value})}
                />

                <HBox reversed>
                    <Button
                        disabled={!this.state.wellIds || !this.state.wellIds.length}
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
