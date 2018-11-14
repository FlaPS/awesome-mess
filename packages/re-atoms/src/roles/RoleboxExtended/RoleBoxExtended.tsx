import * as React from 'react'
import {Dictionary, eqProps, omit, pick} from 'ramda'
import styled from 'styled-components'

import {DivProps} from '../../layout/Div'
import {toIndexedArray} from '@local/utils'
import {Badge} from '../../badges/BadgeExtended'
import CreatingBadge from '../../badges/CreatingBadge'
import contexted from '../../smart/contexted'
import * as PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {ROLE, RoleVO} from '@local/biz'

export type RoleBoxExtendedProps = DivProps & {
    roles: Dictionary<RoleVO>,
    values: string[]
    editable?: boolean
    onChange?: (values: string[]) => void
}

const Wrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
`

const regularBadges = ({values, roles, editable, onChange}: RoleBoxExtendedProps) => {
    const rolesArr = toIndexedArray(pick<RoleVO>(values, roles))
    return rolesArr.map(
        role => (
            <Badge
                role={role}
                editable={editable}
                key={role.name}
                onChange={val => onChange(values.filter(v => v !== val))}
            />
        )
    )


}


const badgeProps = ['roles', 'values', 'editable', 'onChange']

const picKBadgesProps = pick(badgeProps)
const omitBadgesProps = omit([...badgeProps, 'helperText'])
const pickCreateBadgeProps = pick(['roles', 'values', 'onChange'])

const badgesCanBeAdded = ({editable, roles, values}: RoleBoxExtendedProps) =>
    editable && !eqProps('length', Object.keys(roles), values)

const RoleBoxControl = (props: RoleBoxExtendedProps) => (
    <Wrapper {...omitBadgesProps(props)}>
        {badgesCanBeAdded(props) && (
            <CreatingBadge {...pickCreateBadgeProps(props)} />
        )}
        {regularBadges(picKBadgesProps(props))}
    </Wrapper>
)
export const RoleBoxExtended = connect(state => ({roles: ROLE.asMap()(state)}))
(
    contexted({
        disabled: PropTypes.bool,
        readonly: PropTypes.bool,
    })
    (({readonly, disabled, ...props}) =>
        <RoleBoxControl
            editable={!readonly && !disabled}
            {...props}
        />
    )
)
