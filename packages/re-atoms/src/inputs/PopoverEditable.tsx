import * as React from 'react'
import {omit} from 'ramda'
import {Library} from '../styles/SVGLibrary'
import styled, {keyframes} from 'styled-components'
import {default as Div, DivProps} from '../layout/Div'
import {withStateHandlers} from 'recompose'
import TextField from './TextInput'
import Button from 'material-ui/Button'
import onClickOutside from 'react-onclickoutside'
import {colors, Font, restyle} from '../styles'

const omitEditableFieldProps = omit(['value'])
const omitPopupProps = omit(['onCancel', 'onSave', 'shown', 'value'])


type PopoverEditableProps = DivProps & {
    value?: string,
    onValueSave?: (string) => any,
    limit?: number
}

type PopoverEditablePropsHOC = PopoverEditableProps & {
    props?: object,
    popupShown?: boolean,
    onValueChange?: (param: string) => string,
    onShowPopupToggle?: () => object,
    onHidePopup?: () => object,
}

type PopupProps = DivProps & PopoverEditablePropsHOC & {
    shown: boolean,
    value?: string,
    label?: string,
    onSave?: (value: string) => string,
    onCancel?: () => void
}

type PopupPropsHoc = DivProps & {
    value?: string,
    onValueChange?: (param: string) => string,
    handleClickOutside?: () => object,
    reset?: () => object,
    props?: any
}


const showIn = keyframes`
    from {
        height: 20px;
    }

    to {
        height: 141px;
    }
`

// TODO: add into input props callback function for sending changed in field value
const EditField = restyle`
    margin: 10px 5px 20px;
`(TextField)

const EditLabel = restyle`
    font-size: 18px;
`(Font.FontFamily(Div))

const ButtonContainer = restyle`
    display: flex;
    justify-content: space-between;
    margin: 10px 5px 20px;
`(Div)

const PopupEdit: React.SFC<PopupProps> = withStateHandlers(
    (props: PopupProps) => ({value: props.value, props: {...props}}),
    {
        onValueChange: (state, props) => newValue => ({...state, value: newValue}),
        handleClickOutside:
            (state, props) => () => {
                props.onCancel()
                return {...state, value: props.value}
            },
        reset: (state, props) => () => ({...state, value: props.value}),
    }
)(onClickOutside(({onValueChange, handleClickOutside, value, props, reset}: PopupPropsHoc) => (
    <div {...omitPopupProps(props)}>
        <EditField
            label={<EditLabel>{props.label ? props.label : 'Редактировать'}</EditLabel>}
            value={value}
            onChange={e => onValueChange(e.target['value'])}
            multiline={true}
            limit={props.limit}
        />
        <ButtonContainer>
            <Button
                onClick={() => props.onSave(value)}
                type='flat'
            >
                Сохранить
            </Button>
            <Button onClick={() => {
                props.onCancel()
            }} type='flat'>Отмена</Button>
        </ButtonContainer>
    </div>))
) as any

const StyledPopup: React.SFC = styled(PopupEdit)`
    display: flex;
    flex-direction: column;
    position: relative;
    left: 0;
    top: -16px;
    background: #fafafa;
    z-index:9999;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),
                0 1px 5px 0 rgba(0,0,0,0.12),
                0 3px 1px -2px rgba(0,0,0,0.2);
    width: 100%;
    font-family: Roboto;
    font-size: 13px;
` as any

const PopoverEditable: React.SFC<PopoverEditableProps> = withStateHandlers(
    (props: PopoverEditableProps) => ({
        value: props.value,
        popupShown: false,
        props,
    }),
    {
        onValueChange: (state, props) => newValue => {
            props.onValueSave(newValue)
            return {...state, value: newValue, popupShown: !state.popupShown}
        },
        onShowPopupToggle: (state, props) => () => ({...state, popupShown: !state.popupShown}),
        onHidePopup: (state, props) => () => ({...state, popupShown: false}),
    })(({props, value, popupShown, onValueChange, onHidePopup, onShowPopupToggle}: PopoverEditablePropsHOC) => (
    <div {...omitEditableFieldProps(props)}>
        <EditableField onClick={onShowPopupToggle}>
            <FieldText title={value}>{value}</FieldText>
            <EditIcon/>
        </EditableField>

        {popupShown
            ? (
                <ShownPopup>
                    <StyledPopup
                        {...omitPopupProps(props)}
                        onCancel={onHidePopup}
                        onSave={onValueChange}
                        value={value}
                    />
                </ShownPopup>
            ) : <HiddenPopup/>
        }
    </div>)) as any

const ShownPopup = restyle`
    display:flex;
    width:100%;
    animation: ${showIn} 0.1s linear;
`(Div)

const HiddenPopup = restyle`
    width:100%;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.2s, opacity 0.2s linear;
`(Div)

const FieldText = restyle`
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow:hidden;

    &:hover {
        cursor: pointer;
    }
`(Div)

const EditIcon = restyle`
    min-width: 16px;
    height: 16px;
    width: 16px;
    opacity: 0;

    &:hover {
        cursor: pointer;
        fill: ${colors.PRIMARY};
    }
`(Library.Edit)

const EditableField = restyle`
    display: flex;
    justify-content: space-between;
    color: ${colors.DEFAULT_BLACK};
    font-size: 13px;

    &:hover ${EditIcon} {
        opacity: 1;
        transition: opacity 0.2s linear;
    }
`(Font.FontFamily(Div))

export default PopoverEditable
