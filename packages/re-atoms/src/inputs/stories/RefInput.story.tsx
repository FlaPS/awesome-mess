import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {JOB, WELL} from '@local/biz'
import FrontendProvider from '../../FrontendProvider'
import genericForm from '../../smart/genericForm'
import RefInput from '../RefInput'

const JobForm = genericForm(JOB)

declare const module
storiesOf('Inputs/RefInput', module)
    .add('Ref input with scheme', () =>
        <FrontendProvider>
            <RefInput property={'projectId'} scheme={'WELL'} value={'1'}>

            </RefInput>
        </FrontendProvider>
    )
    .add('Ref input with scheme and complex name function', () =>
        <FrontendProvider>
            <RefInput property={'wellId'} scheme={'JOB'} value={'1'}>

            </RefInput>
        </FrontendProvider>
    )
