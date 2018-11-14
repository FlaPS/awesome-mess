import * as React from 'react'
import {RoleVO} from '@local/biz'
import {SpanProps} from '../layout/Span'

import {Label, RegularBadge, RemoveIcon} from './elements'

export type RegularBadgeProps = SpanProps & {
    key: string
    color: string
    disabled: boolean
}

export type BadgeExtendedProps = {
    role: RoleVO
    editable: boolean
    onChange: (value: string) => void
    style?: React.CSSProperties
}

export const Badge = ({role, editable, onChange, ...rest}: BadgeExtendedProps) => (
    <RegularBadge key={role.roleId} color={role.color} disabled={!editable} {...rest}>
        <Label>{role.name}</Label>
        {editable && <RemoveIcon onClick={() => onChange(role.roleId)}/>}
    </RegularBadge>
)
