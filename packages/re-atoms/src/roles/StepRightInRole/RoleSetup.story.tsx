import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import StepRightInRole from './RoleSetup'
import {compose, withHandlers, withState} from 'recompose'
import styled from 'styled-components'


const withSelection = compose(
    withState('value', 'onChange', 0),
    withHandlers({onChange: ({onChange}) => value => onChange(_ => value)})
)

const SmartStepRightInRole = withSelection(({value, onChange, ...props}: any) => (
    <StepRightInRole
        value={value}
        onChange={value => {
            action('change')(value)
            onChange(value)
        }}
        {...props}
    />
))

const Container = styled.div`
    margin: 50px 0 0 50px;
    width: fit-content;
    background: white;
`

declare const module
storiesOf('RoleSetup', module)
    .add('three at once!', () =>
        <div>
            <Container>
                <SmartStepRightInRole
                    count={10}
                    disabled={[3, 5, 6]}
                />
            </Container>
            <Container>
                <SmartStepRightInRole
                    count={5}
                    disabled={[]}
                />
            </Container>
            <Container>
                <SmartStepRightInRole
                    count={3}
                    disabled={[2, 3]}
                />
            </Container>
        </div>
    )
