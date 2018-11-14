import * as React from 'react'
import {formPure} from '../../../smart/Form'
import Paper from '../../../layout/Paper'
import {Subheading} from '../../../styles/Typography'

import {bindInput} from '../../../smart/form/bindInput'
import {HBox} from '../../../layout/Box'
import TextInput from '../../../inputs/TextInput'
import {GROUP, GroupVO} from '@local/biz'

export default formPure(GROUP, ['name'])
    .ap(props =>
        <div>
            <Paper style={{padding: '32px', width: '600px', marginBottom: '30px'}}>
                <Subheading>
                    Назовите групппу пользователей
                </Subheading>
                <HBox>
                    <TextInput
                        label='Название группы'
                        {...bindInput<GroupVO>('name')(props)}
                    />
                </HBox>
            </Paper>
        </div>
    )
