import CenteredCaption from '../../../layout/CenteredCaption'
import * as React from 'react'
import {FormSection, Paper} from '../../../layout/index'
import Library from '../../../styles/SVGLibrary'
import {GROUP, sel, StateWithBiz} from '@local/biz'
import caseRender from '../../../smart/caseRender'
import {connect, DispatchProp} from 'react-redux'
import {Pure} from '../../../smart/Pure'
import renderChildren from '../../../smart/renderChildren'
import {Caption, Title} from '../../../styles/Typography'
import nav from '../../../app/nav'
import Link from '../../../controls/Link'


type UserGroupInfoProps = {
    userGroup: any
    groupId: any
} & DispatchProp<any>

const GroupInfoView = (props: UserGroupInfoProps) =>
    <div>
        <Link push to={nav.app.access.userGroup.index.get(props)}>
            <Title>{props.userGroup.name}</Title>
        </Link>
        <Caption>
            {props.userGroup.comment}
        </Caption>
    </div>

const MaybeGroupView = caseRender(GroupInfoView)
    .isNil('userGroup', CenteredCaption('группа не найдена'))
    .isNil('groupId', CenteredCaption('группа не назначена'))

const Card = Pure()
    .of(MaybeGroupView)
    .contramap(({children, ...props}) =>
        <Paper>
            <FormSection width={540} label='Группа' icon={Library.PersonCopy}>
                {renderChildren(children, props)}
            </FormSection>
        </Paper>
    )


const mapStateTopProps = (state: StateWithBiz, props: { groupId: string }) => ({
    userGroup: sel(GROUP)
        .asList()(state)
        .find(group => group.groupId === props.groupId),
})


export default connect(mapStateTopProps)(Card)

