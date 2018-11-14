import * as React from 'react'
import {omit} from 'ramda'
import styled from 'styled-components'
import Library from '../styles/SVGLibrary'
import {restyle} from '../styles/restyle'
import Div from '../layout/Div'
import Paper from '../layout/Paper'

type refsNavigationProps = {
    refNames: Array<string>
    onHoverChange: (e: any) => string
    onNavigationClick: (e: any) => string
    onMouseLeave: () => void
}

const NavLetterContainer = restyle`
    width: 14px;
    margin-right: 14px;
    &:not(:last-child):after
{
        position: absolute;
        top: 27px;
        margin-left: 17px;
        height: 2px;
        width: 2px;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.38);
        content:'';
}
`(Div)

const omitReactNavigationProps = omit(['refNames', 'onHoverChange', 'onNavigationClick'])

const RefsNavigation = (props: refsNavigationProps) => (
    <Paper {...omitReactNavigationProps(props)}>
        <div className='lettersNav' onMouseLeave={props.onMouseLeave}>
            {props.refNames.map(
                (sortedName, number) =>
                    <NavLetterContainer key={'nc' + number.toString()}>
                        <div
                            key={number}
                            id={'l' + number.toString()}
                            onClick={props.onNavigationClick}
                            className='navLetter'
                            onMouseEnter={props.onHoverChange}
                        >
                            {sortedName}
                        </div>
                    </NavLetterContainer>
            )}
        </div>
        <div>
            <Library.Search/>
        </div>
    </Paper>
)


export default styled(RefsNavigation)`
position: fixed;
width: 100%;
box-sizing: border-box;
display:flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding: 0 44px;
background-color: #FFFFFF;
height: 56px;

.lettersNav
{
    display:flex;
    flex-direction: row;
}

.navLetter
{
    color: rgba(0,0,0,0.54);
    font-family: Roboto;
    font-size: 12px;
    font-weight: 500;
    line-height: 26px;
}

.navLetter:hover
{
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    line-height: 26px;
}

` as any
