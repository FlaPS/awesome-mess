import * as React from 'react'
import Library from './SVGLibrary'
import Div from '../layout/Div'
import styled from 'styled-components'
import Tooltip from 'material-ui/Tooltip'
import colors from './colors'

const Lib = styled(Div)`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
`

const IconContainer = styled(Div)`
    padding: 12px;
    color: ${colors.SOFT_BLACK};
`

const renderIcon = key => {
    const Icon = Library[key]
    return (
        <Tooltip
            title={'Library.' + key}
            key={key}
        >
            <IconContainer>
                <Icon/>
            </IconContainer>
        </Tooltip>
    )
}

const renderLibrary = () =>
    Object.keys(Library).map(renderIcon)


export default (props) =>
    <Lib {...props}>
        {renderLibrary()}
    </Lib>
