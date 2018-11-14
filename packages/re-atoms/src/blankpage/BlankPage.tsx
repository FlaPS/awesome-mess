import * as React from 'react'
import {omit} from 'ramda'
import {Button} from '../controls'
import {colors, Font, Library, restyle} from '../styles'
import {Div} from '../layout'

export type BlankPageProps = {
    label: string,
    subLabel: string,
    icon: JSX.Element,
    onAddClick: (e: any) => any
}

const omitBlankPageProps = omit(['label', 'subLabel', 'icon', 'onAddClick'])

const Label = restyle`
    color: ${colors.SOFT_BLACK};
    font-size: 34px;
    line-height: 40px;
    text-align: center;
    max-width: 400px;
`(Font.FontFamily(Div))

const ButtonContainer = restyle`
    margin-top: 136px;
    height: 82px;
    display: flex;
    flex-direction: column;
    align-items: center;
`(Div)

const AddButton = restyle`
    position: inherit;
    z-index: 2;
    height: 56px;
    width: 56px;
    background-color: ${colors.DEEP_BLUE};
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.12), 0 6px 6px 0 rgba(0,0,0,0.24);
    border-radius: 50%;

    &:hover {
        background-color: ${colors.DEEP_BLUE};
    }
`(Button)

const SubLabel = restyle`
    margin-top: 11px;
    color: ${colors.EXTRA_SOFT_BLACK};
    font-size: 13px;
    line-height: 15px;
`(Font.FontFamily(Div))

const Line = restyle`
    position: relative;
    top: -53px;
    height: 1px;
    width: 100vw;
    opacity: 0.38;
    background-color: ${colors.DARK_GRAY};
`(Div)

const BlankPageContainer = restyle`
    padding-top: 136px;
    display: flex;
    flex-direction: column;
    align-items: center;
`(Div)

export default (props: BlankPageProps) =>
    <BlankPageContainer {...omitBlankPageProps(props)}>
        {props.icon}
        <Label>{props.label}</Label>
        <ButtonContainer>
            <AddButton  variant='fab' primary onClick={props.onAddClick}>
                <Library.Add/>
            </AddButton>
            <SubLabel>{props.subLabel}</SubLabel>
            <Line/>
        </ButtonContainer>
    </BlankPageContainer>
