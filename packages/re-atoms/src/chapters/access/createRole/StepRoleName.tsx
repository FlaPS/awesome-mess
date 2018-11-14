import * as React from 'react'
import {ROLE} from '@local/biz'
import {formPure} from '../../../smart/Form'
import Paper from '../../../layout/Paper'
import {Subheading} from '../../../styles/Typography'

import {bindInput} from '../../../smart/form/bindInput'
import {HBox} from '../../../layout/Box'
import {RoleBoxDisconnected} from '../../../roles/Rolebox/RoleBox'
import TextInput from '../../../inputs/TextInput'
import {restyle} from '../../../styles/restyle'

const RoleBoxContainer = restyle`
    position: relative;
`(HBox)

const StyledSubheading = restyle`
    margin-bottom: 32px;
`(Subheading)

const Role = restyle`
    position: absolute;
    right: 0;
    top: calc(50% - 23px);
`(RoleBoxDisconnected)

const StyledPaper = restyle`
    padding: 32px 24px;
    &:not(:last-child) {
        margin-bottom: 30px;
    }
`(Paper)

export default formPure(ROLE, ['name', 'comment'])
    .ap(props =>
        <div style={{width: '600px'}}>
            <StyledPaper>
                <StyledSubheading>
                    Назовите роль
                </StyledSubheading>
                <RoleBoxContainer>
                    <TextInput
                        label='Название роли'
                        {...bindInput('name')(props)}
                    />
                    {props.model.name &&
                    <Role
                        values={['0']}
                        roles={{
                            ['0']: {
                                color: props.model.color,
                                name: props.model.name,
                                roleId: '0',
                            },
                        }}
                    />
                    }
                </RoleBoxContainer>
            </StyledPaper>

            <StyledPaper>
                <StyledSubheading>
                    Комментарий
                </StyledSubheading>
                <HBox>
                    <TextInput
                        label='Комментарий'
                        {...bindInput('comment')(props)}
                    />
                    <div style={{width: '16px'}}/>
                </HBox>
            </StyledPaper>
        </div>
    )
