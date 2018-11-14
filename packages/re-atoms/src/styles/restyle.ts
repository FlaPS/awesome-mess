import * as React from 'react'
import {defaultProps} from 'recompose'
import styled from 'styled-components'

type Comp<P> = React.ComponentType<P>

export const restyle = (template, ...rest) =>
    <P>(StyledOne: Comp<P>) =>
        styled(StyledOne as React.StatelessComponent<P>)(template, ...rest) as any as Comp<P>
