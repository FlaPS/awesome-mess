import * as React from 'react'
import {RoleVO} from '@local/biz'
import {SpanProps} from '../layout/Span'
import Menu from 'material-ui/Menu'
import MenuItem from '../layout/MenuItem'

import {AddBadge, AddIcon, Label} from './elements'
import {messageFactory, Pure} from '../smart/Pure'
import Toggle from '../smart/Toggle'
import {AssociativeArray} from '@local/utils'

export type CreateBadgeProps = SpanProps & {
    roles: AssociativeArray<RoleVO>
    values: string[]
    onChange: (values: string[]) => void
}

const renderAppendingRole =
    ({roleId, name}: RoleVO, onClick: (str: string) => void) => (
        <MenuItem key={roleId} onClick={() => onClick(roleId)}>
            {name}
        </MenuItem>
    )

const messages = {
    onChange: messageFactory<string[]>('onChange'),
}

const PureComp =
    Pure<CreateBadgeProps>()
        .concat(Toggle)
        .addMsg(messages)
        .addReducer<CreateBadgeProps>((state, action) =>
            action.type === 'onChange'
                ? {...state, values: action.payload}
                : state
        )

const CreatingBadge =
    (props: typeof PureComp.Props) =>
        <PureComp values={props.values} roles={props.roles} onChange={props.onChange}>

            {({makeRef, pureRefs, values, roles, onToggle, on, onChange}) => (
                <AddBadge onClick={() => onToggle(true)} ref={makeRef('badge')}>
                    <Label>Добавить роль</Label>
                    <AddIcon/>
                    <Menu open={on} anchorEl={pureRefs['badge']}>
                        {
                            Object.keys(roles)
                                .map(key => roles[key])
                                .filter(vo => !values.includes(vo.roleId))
                                .map(vo => renderAppendingRole(vo, id => onChange([id, ...values])))
                        }
                    </Menu>
                </AddBadge>
            )}

        </PureComp>

export default CreatingBadge
