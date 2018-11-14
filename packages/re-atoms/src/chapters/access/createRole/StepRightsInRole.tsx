import * as React from 'react'
import styled from 'styled-components'

import {ROLE} from '@local/biz'

import {formPure} from '../../../smart/Form'
import {bindCustomComponent} from '../../../smart/form/bindInput'

import {Div, HBox, Paper, Spans} from '../../../layout'
import RoleSetup from '../../../roles/StepRightInRole/RoleSetup'
import {rightLabels, rightStates} from '../../../roles/createRoleRights'
import {colors} from '../../../styles'

const border = direction =>
    `border-${direction}: 1px solid ${colors.BORDER_GRAY};`

const Bordered = styled(Div)`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    flex: 0 0 144px;
    ${border('left')}
    ${border('bottom')}

    &:last-child {
        ${border('right')}
    }

    &:first-child {
        justify-content: flex-start;
        flex-grow: 2;
        padding-left: 24px;
    }

    > * {
        margin: 0;
    }
`

const SetupRow = ({label, ...props}: { label: string, value: number, onChange: (value: number) => void }) => (
    <HBox stretch style={{alignItems: 'stretch'}}>
        <Bordered>
            <Spans.Body2>{label}</Spans.Body2>
        </Bordered>
        <RoleSetup count={rightStates.length} {...props} />
    </HBox>
)

const renderSetup = props => labelKey => {
    if (labelKey === 'drill' || labelKey === 'survey') {
        return (
            <SetupRow
                {...bindCustomComponent<number>(['reportRights', labelKey])(props)}
                label={rightLabels[labelKey]}
            />
        )
    } else {
        return (
            <SetupRow
                {...bindCustomComponent<number>(['rights', labelKey])(props)}
                label={rightLabels[labelKey]}
            />
        )
    }
}

const Header = () => (
    <HBox style={{alignItems: 'center'}}>
        <Bordered>
            <Spans.Caption>
                Основные функции в системе
            </Spans.Caption>
        </Bordered>

        {
            rightStates.map(state => (
                <Bordered>
                    <Spans.Caption>
                        {state}
                    </Spans.Caption>
                </Bordered>
            ))
        }
    </HBox>
)

export default formPure(ROLE, ['rights'])
    .ap(props =>
        <Paper>
            <Header/>
            {
                Object
                    .keys(rightLabels)
                    .map(renderSetup(props))
            }
        </Paper>
    )
