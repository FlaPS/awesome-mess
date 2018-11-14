import * as React from 'react'
import {PROJECT, sel, WellVO} from '@local/biz'
import {Div, FormSection, HBox, Span, VBox} from '../../../layout'
import {colors, Font, Library, restyle} from '../../../styles'
import {connect} from 'react-redux'
import caseRender from '../../../smart/caseRender'
import {Fab} from '../../../controls'
import {CreationInfo} from '../../../controls/AdminItemToolbar'
import nav from '../../../app/nav'
import Link from '../../../controls/Link'

const PseudoButton = restyle`
    &:hover {
        color: ${colors.DEEP_BLUE} !important;
        text-decoration: underline;
        cursor: pointer;
    }
`(Span)

const Header = Font.subheading()(PseudoButton)
const Caption = Font.caption()(Div)

const EmptySection =
    ({wellId, onAdd}) =>
        <FormSection stretch label='Скважина не в группе'>
            <VBox gap={24} style={{alignItems: 'center'}}>
                <Caption>
                    Скважина не состоит в группе. Добавьте скважину в группу
                </Caption>
                <Fab staticPosition onClick={() => onAdd && onAdd()}>
                    <Library.Add/>
                </Fab>
            </VBox>
        </FormSection>

const FlexContainer = restyle`
    justify-content: space-between;
    align-items: center;
`(HBox)

const Creation = restyle`
    margin: 0;
`(CreationInfo)

const CommentIcon = restyle`
    margin-right: 10px;
    width: 16px !important;
    height: 16px !important;
    color: ${colors.DISABLED_GRAY} !important;
`(Library.Message)

const Description = Font.caption2(restyle`
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
`)(Div)

const Section =
    ({project}) =>
        <FormSection gap={10} stretch label='Скважина включена в группу'>
            <FlexContainer gap={24}>
                <Link decoration={false} push to={nav.app.chapterWells.project.index.get(project)}>
                    <Header>{sel(PROJECT).getFullName(project)()}</Header>
                </Link>
                <Creation
                    creationDate={project.creationDate}
                    creatorUserId={project.creatorUserId}
                />
            </FlexContainer>
            {
                project.comment &&
                <Description>
                    <CommentIcon/>
                    <span>
                            {project.comment}
                        </span>
                </Description>
            }
        </FormSection>

const mapStateToProps =
    (state, {projectId}) =>
        ({project: PROJECT.byKey(projectId)(state)})

const ConnectedSection = connect(mapStateToProps)(Section)

export default caseRender<WellVO & { onAdd?: Function }>(ConnectedSection)
    .isNilOrEmpty('projectId', EmptySection)
