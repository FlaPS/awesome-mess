import * as React from 'react'
import styled from 'styled-components'
import {restyle} from '../styles'
import Div from '../layout/Div'
import Library from '../styles/SVGLibrary'
import colors from '../styles/colors'

type contractorButtonProps = {
    onClick: () => void
}

const IconDiv = restyle`
    width: 40px;
    height: 36px;
    border-radius: 2px;
    margin-right: 8px;
    background-color: ${colors.EXTRA_SOFT_BLACK};
    display: flex;
    justify-content: center;
    align-items: center;
`(Div)

const AddContractorButton = styled.button`
    background-color: ${colors.TRANSPARENT};
    padding-right: 16px;
    display: flex;
    align-items: center;
    border: none;

    &:hover {
        cursor: pointer;
    }

    &:focus {
        outline: none;
    }
`

const AddContractorButtonLabel = restyle`
    font-family: Roboto;
    font-size: 13px;
    text-align: left;
    color: ${colors.SOFT_BLACK};
`(Div)

const WhiteIcon = restyle`
    color: ${colors.WHITE}
`(Library.Add)

export default (props: contractorButtonProps) =>
    <AddContractorButton onClick={props.onClick}>
        <IconDiv>
            <WhiteIcon/>
        </IconDiv>
        <AddContractorButtonLabel>
            Добавить подрядчика
        </AddContractorButtonLabel>
    </AddContractorButton>

