import * as React from 'react'
import {formPure} from '../../../smart/Form'
import {ROLE, schemeLens, sel, USER} from '@local/biz'
import Paper from '../../../layout/Paper'
import {RoleBoxExtended} from '../../../roles/RoleboxExtended/RoleBoxExtended'
import connectSpec from '../../../smart/connectSpec'
import {toIndexedArray} from '@local/utils'
import {Subheading} from '../../../styles/Typography'
import getStore from '../../../store/'

const Form = formPure(USER, ['roleIds'])

const ConnectedRoles = connectSpec({
    roles: sel(ROLE).asList(),
})(RoleBoxExtended)

export default Form.ap(props =>
    <Paper style={{padding: '32px', width: '600px'}}>
        <Subheading style={{marginBottom: 32}}>
            Функционал пользователя в системе может быть ограничен.
            Для этого назначьте пользователю одну или несколько ролей
        </Subheading>
        <ConnectedRoles
            editable={true}
            roles={toIndexedArray(schemeLens(ROLE).get(getStore().getState()))}
            onChange={value => {
                props.onChange({property: 'roleIds', value})
            }}
            values={props.model.roleIds || []}
        />
    </Paper>
)
