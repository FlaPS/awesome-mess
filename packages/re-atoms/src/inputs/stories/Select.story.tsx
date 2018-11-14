import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {JOB} from '@local/biz'
import FrontendProvider from '../../FrontendProvider'
import genericForm from '../../smart/genericForm'

const JobForm = genericForm(JOB)
/* formPure(JOB, ['jobTypeId', 'creatorUserId'])
   .ap(props =>
       <div onClick={props.onInvalid()} >
               {JSON.stringify(props.model)}
       </div>
   )*/


declare const module
storiesOf('Inputs/GenericInputs', module)
    .add('Controlled input', () =>
        <FrontendProvider>
            <div>Empty select</div>
        </FrontendProvider>
    )
    .add('Generic form ', () =>
        <FrontendProvider>
            <JobForm forked={true} model={{wellId: '2'}}/>
        </FrontendProvider>
    )
