import * as React from 'react'
import {connect} from 'react-redux'
import {GROUP, sel, UserVO} from '@local/biz'
import {Div, FormSection, HBox, Span, VBox} from '../../../layout'
import {colors, Font, Library, restyle} from '../../../styles'
import caseRender from '../../../smart/caseRender'
import {Fab, Link} from '../../../controls'
import {CreationInfo} from '../../../controls/AdminItemToolbar'
import nav from '../../../app/nav'


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
    ({userId, onAdd}) =>
        <FormSection stretch label='Пользователь не в группе' icon={Library.UserGroups}>
            <VBox gap={24} style={{alignItems: 'center'}}>
                <Caption>
                    Пользователь не состоит в группе. Добавьте пользователя в группу
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
    ({userGroup}) =>
        <FormSection gap={10} stretch label='Группа' icon={Library.UserGroups}>
            <FlexContainer gap={24}>
                <Link decoration={false} push to={nav.app.access.userGroup.index.get(userGroup)}>
                    <Header>{GROUP.getFullName(userGroup)()}</Header>
                </Link>
                <Creation
                    creationDate={userGroup.creationDate}
                    creatorUserId={userGroup.creatorUserId}
                />
            </FlexContainer>
            {
                userGroup.comment &&
                <Description>
                    <CommentIcon/>
                    <span>
                            {userGroup.comment}
                        </span>
                </Description>
            }
        </FormSection>

const mapStateToProps =
    (state, {groupId}) =>
        ({userGroup: sel(GROUP).byKey(groupId)(state)})

const ConnectedSection = connect(mapStateToProps)(Section)

export default caseRender<UserVO & { onAdd: Function }>(ConnectedSection)
    .isNilOrEmpty('groupId', EmptySection)
