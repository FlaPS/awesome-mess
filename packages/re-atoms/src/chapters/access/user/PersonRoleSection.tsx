import * as React from 'react'
import {Library} from '../../../styles'
import {USER} from '@local/biz'
import {formPure} from '../../../smart/Form'
import {FormSection} from '../../../layout'
import {RoleBoxExtended} from '../../../roles/RoleboxExtended/RoleBoxExtended'


export default formPure(USER, ['roleIds'])
    .of(props => (
        <FormSection label='Роли' icon={Library.PersonCopy}>
            <RoleBoxExtended
                values={props.model.roleIds || []}
                onChange={values => props.onChange({property: 'roleIds', value: values})}
            />
        </FormSection>
    ))
