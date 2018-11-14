import * as React from 'react'
import {restyle} from '../../styles'
import Button from 'material-ui/Button'
import styled from 'styled-components'
import Library from '../../styles/SVGLibrary'
import Div from '../../layout/Div'
import {omit} from 'ramda'
import {Scheme} from '@local/biz'
import colors from '../../styles/colors'

type SubLabelProps = {
    active: boolean,
    edit: boolean
    scheme: Scheme<any, any>,
    onShowActive: () => any,
    onShowAll: () => any,
    onAddClick: () => any
    onSave: () => any,
    onEditClick: () => any
    onCancel: () => any
    width?: number
    saveAvailable: boolean
    activeAvailable: boolean
    allAvailable: boolean
}

const omitSubLabelProps =
    omit([
        'active',
        'edit',
        'scheme',
        'onShowActive',
        'onShowAll',
        'onAddClick',
        'onSave',
        'onEditClick',
        'onCancel',
        'saveAvailable',
        'activeAvailable',
    ])

const SaveButton = restyle`
    background-color: ${props => props.disabled ? colors.BORDER_GRAY : colors.PRIMARY}!important;
    color: ${colors.WHITE}!important;

    &:hover {
        background-color: ${colors.ACCENT_BLUE}!important;
        box-shadow: 0 0 2px 0 rgba(37,37,37,0.12), 0 2px 2px 0 rgba(37,37,37,0.24);
    }
`(Button)

const CancelButton = restyle`
color: ${colors.SOFT_BLACK}!important;`
(Button)

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 0 12px 0;
    align-items: center;
    height: 32px;
    width: ${props => props.width ? props.width : 'auto'}px;
`

const ToggleButton = styled.button`
    color: ${props => props.active ? colors.DEEP_BLUE : colors.SOFT_BLACK};
    background: none;
    font-family: Roboto;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 20px;
    margin-left: 8px;
    outline: none;
    text-align: center;
    border: ${props => props.active ? `1px solid ${colors.DEEP_BLUE}` : `1px solid ${colors.TRANSPARENT}`};
    border-radius: 2px;
    cursor: pointer;

    &:disabled {
        cursor: default;
        color: ${colors.EXTRA_SOFT_BLACK};
    }
`

const ToggleButtonContainer = restyle
    `
    display: flex;
    width: 214px;
    align-items: center;
    color: ${colors.SOFT_BLACK};
    font-family: Roboto;
    font-size: 12px;
    `(Div)


const AddButton = styled(Button)`
    height: 36px;
    color: ${colors.PRIMARY}!important;
    padding: 0 16px 0 8px!important;
    font-family: Roboto!important;
    font-size: 14px!important;
    font-weight: 500!important;
`


const EditButton = styled(Button)`
    height: 36px;
    margin-right: -11px;
    color: ${colors.PRIMARY}!important;
    padding: 0 8px 0 16px!important;
    font-family: Roboto!important;
    font-size: 14px!important;
    font-weight: 500!important;
`


const SubLabel = (props: SubLabelProps) => (
    <FlexContainer {...omitSubLabelProps(props)}>
        {props.edit ?
            (
                <AddButton style={{marginLeft: '-12px'}} onClick={props.onAddClick}>
                    <Library.Add style={{marginRight: '9px'}}/>
                    {`Добавить ${props.scheme.lang.singular}`}</AddButton>
            ) : (<ToggleButtonContainer>
                Показать:
                <ToggleButton
                    active={props.active}
                    disabled={!props.activeAvailable}
                    title={!props.activeAvailable ? 'Нет активных ' + props.scheme.lang.plural : ''}
                    onClick={props.onShowActive}
                >
                    Активные
                </ToggleButton>
                <ToggleButton
                    active={!props.active}
                    onClick={props.onShowAll}
                    disabled={!props.allAvailable}
                    title={!props.allAvailable && 'Нет удаленных ' + props.scheme.lang.plural}
                >
                    Все
                </ToggleButton>
            </ToggleButtonContainer>)}
        {props.edit ?
            (<div>
                <CancelButton onClick={props.onCancel} style={{marginRight: '8px'}}>Отмена</CancelButton>
                <SaveButton disabled={!props.saveAvailable} onClick={props.onSave}>Сохранить</SaveButton>
            </div>) : (
                <EditButton onClick={props.onEditClick}>
                    Редактировать
                    <Library.Edit style={{marginLeft: '8px'}}/>
                </EditButton>
            )}
    </FlexContainer>)

export default SubLabel
