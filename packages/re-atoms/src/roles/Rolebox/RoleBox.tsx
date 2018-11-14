import * as React from 'react'
import {DivProps} from '../../layout/Div'
import {compose, head, join, map, omit, split, take, toUpper} from 'ramda'
import {ROLE, RoleVO, schemeLens} from '@local/biz'
import styled from 'styled-components'

import * as Typography from '../../styles/font'
import {restyle} from '../../styles/restyle'
import Span from '../../layout/Span'
import {AssociativeArray} from '@local/utils'
import connectSpec from '../../smart/connectSpec'

const badgeParams = {
    size: 32,
    marginLeft: 6,
}

const Badge = Typography.body2(restyle`
    margin-bottom: 0;
    display: inline-block;
    background-color: ${props => props.color};
    height: ${badgeParams.size}px;
    width: 32px;
    line-height: 32px;
    border-radius: 50%;
    color: white;
    text-align: center;

    &:not(:first-of-type) {
        margin-left: ${badgeParams.marginLeft}px;
    }
`)(Span)

const Wrapper = styled.div`
    overflow-x: hidden;
    word-wrap: break-word;
    white-space: pre;
`

const omitRoleBoxProps = omit(['roles', 'data'])

const badgeTitle = compose(
    join(''),
    map(toUpper),
    map(head),
    take(3),
    split(' ')
)

export type RoleBoxProps = DivProps & {
    roles?: AssociativeArray<RoleVO>
    values?: string[]
}

const createBadge = ({roleId, color, name}: RoleVO) =>
    <Badge key={roleId} color={color}>
        {name && badgeTitle(name)}
    </Badge>

const renderBadge: (x: AssociativeArray<RoleVO>) => (y: string[]) => JSX.Element[] =
    roles =>
        compose(
            map(createBadge),
            map(roleId => roles[roleId])
        )


export const RoleBoxDisconnected = (props: RoleBoxProps) =>
    <Wrapper {...omitRoleBoxProps(props)}>
        {renderBadge(props.roles)(props.values || [])}
    </Wrapper>

export const RoleBox = connectSpec({
    roles: schemeLens(ROLE).get,
})(RoleBoxDisconnected)
