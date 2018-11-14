import * as React from 'react'
import {formPure} from '../../../smart/Form'
import Paper from '../../../layout/Paper'
import {Subheading} from '../../../styles/Typography'
import {bindInput} from '../../../smart/form/bindInput'
import {HBox} from '../../../layout/Box'
import TextInput from '../../../inputs/TextInput'
import {PROJECT, ProjectVO} from '@local/biz'

export default formPure(PROJECT, ['name'])
    .ap(props =>
        <div>
            <Paper style={{padding: '32px', width: '600px', marginBottom: '30px'}}>
                <Subheading>
                    Назовите групппу скважин
                </Subheading>
                <HBox>
                    <TextInput
                        label='Название группы скважин'
                        {...bindInput('name')<ProjectVO>(props)}
                    />
                </HBox>
            </Paper>
        </div>
    )
