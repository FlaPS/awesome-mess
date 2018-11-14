import * as React from 'react'
import {Div, overlay} from '../layout'
import {omit} from 'ramda'
import {Button} from '../controls'
import {colors, restyle} from '../styles'
import CustomScrollbar from '../controls/CustomScrollbar'

export type ModalListDialogProps = {
    title: string
    label?: string
    subLabel?: string
    text: string
    list: Array<string>
    onCancel: () => void
    cancelText?: string
    onText?: string
    onConfirm: () => void
}

const omitModalListDialogProps = omit([
    'label',
    'subLabel',
    'list',
    'onCancel',
    'onConfirm',
    'cancelText',
    'confirmText',
])

export const DialogBox = restyle`
    width: 50%;
    max-width: 640px;
    border-radius: 2px;
    background-color: ${colors.WHITE};
    box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14),
                0 6px 30px 5px rgba(0,0,0,0.12),
                0 8px 10px 0 rgba(0,0,0,0.2);
    padding: 24px 24px 8px;
    display: flex;
    flex-direction: column;
`(Div)

export const Label = restyle`
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 14px;
`(Div)

const SubLabel = restyle`
    color: ${colors.SOFT_BLACK};
    font-family: Roboto;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 40px;
`(Div)

const ListContainer = restyle`
    max-height: 240px;
    margin-bottom: 8px;
    padding-bottom: 24px;
    display:flex;
    flex-wrap: wrap;
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 15px;
    line-height: 12px;
`(CustomScrollbar)

const ListItem = restyle`
    height: 32px;
    flex: 1 0 45%;
    box-sizing: border-box;
    min-width: 296px;
    padding-right: 24px;

    @media (max-width: 800px) {
        flex: 1 0 100%;
    }
`(Div)

export const ButtonsRow = restyle`
    position: relative;
    right: -16px;
    display: flex;
    flex-direction: row-reverse;
    color: ${colors.PRIMARY};
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    line-height: 10px;
`(Div)

export const Empty = restyle`
    width:8px;
`(Div)


const ModalListDialogContainer = restyle`
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
`(overlay(Div))

export default (props: ModalListDialogProps) => (
    <ModalListDialogContainer {...omitModalListDialogProps(props)}>
        <DialogBox>
            <Label>{props.label} </Label>
            <SubLabel> {props.subLabel}</SubLabel>
            <ListContainer>
                {props.list.map((item, counter) => <ListItem key={counter}>{item}</ListItem>)}
            </ListContainer>
            <ButtonsRow>
                <Button color='inherit' onClick={props.onConfirm}>Добавить</Button>
                <Empty/>
                <Button color='inherit' onClick={props.onCancel}>Отмена</Button>
            </ButtonsRow>
        </DialogBox>
    </ModalListDialogContainer>
)
