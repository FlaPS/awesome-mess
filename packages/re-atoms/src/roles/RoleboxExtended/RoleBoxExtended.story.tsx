import * as React from 'react'
import styled from 'styled-components'
import {storiesOf} from '@storybook/react'
import {RoleBoxExtended} from './RoleBoxExtended'
import {ROLE, sel} from '@local/biz'

import IconButton from '../../controls/IconButton'
import {Library} from '../../styles/SVGLibrary'

import {compose, withHandlers, withState} from 'recompose'

const sizes = {
    medium: 350,
    small: 150,
}

const Block = styled.div`
    padding-top: 10px;
    background-color: #ebebeb;
`

const MediumContainer = Block.extend`
    max-width: ${sizes.medium}px;
`

const SmallContainer = Block.extend`
    max-width: ${sizes.small}px;
`
const roles = sel(ROLE).asMap()()

const withValues = compose(
    withState('values', 'changeValues', Object.keys(roles)),
    withState('editable', 'changeEditable', false),
    withHandlers({
        onChange: ({changeValues}) => values => changeValues(_ => values),
        onClick: ({changeEditable}) => _ => changeEditable(editable => !editable),
    })
)


const BoxWithValues = withValues(({onChange, values, onClick, editable}: any) =>
    <div>
        <div>
            <IconButton onClick={onClick}>
                <Library.Edit fill={editable ? 'blue' : 'inherit'}/>
            </IconButton>
        </div>
        <RoleBoxExtended
            roles={roles}
            values={values}
            editable={editable}
            onChange={onChange}
        />
    </div>
)

declare const module
storiesOf('RoleBoxExtended', module)
    .add('Default', () => (
        <BoxWithValues/>
    ))
    .add(`Wrapped: 'max-width: ${sizes.medium}px'`, () => (
        <MediumContainer>
            <BoxWithValues/>
        </MediumContainer>
    ))
    .add(`Wrapped: 'max-width: ${sizes.small}px'`, () => (
        <SmallContainer>
            <BoxWithValues/>
        </SmallContainer>
    ))
