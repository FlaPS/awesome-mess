import caseRender from '../smart/caseRender'
import contextedInput from './contextedInput'
import * as React from 'react'
import styled from 'styled-components'
import {restyle} from '../styles'
import Div, {DivProps} from '../layout/Div'
import Library from '../styles/SVGLibrary'
import colors from '../styles/colors'

type LiteTextInputProps = DivProps & {
    onChange: (value: string) => void
    value?: string
    icon?: React.ComponentType
    disabled?: boolean
    readonly?: boolean
    error?: boolean
    helperText?: string
    maxLength?: number
}

const defaultLiteTextInputProps = {
    value: '',
    icon: Library.Edit,
    onChange: value => null,
}

const Wrap = restyle
    `
    display: inline-flex;
    align-items: stretch;
    position: relative;
    cursor: pointer;
    width: 100%
`
(Div)


const Error = restyle
    `
    position: absolute;
    top: 28px;
    color: ${colors.LIGHT_RED};
    font-size: 12px;
`
(Div)

// TODO: needed some signal for all fields revalidate on change to avoid validation bag during swapping values

const EditableInput: React.ComponentType<LiteTextInputProps> =
    ({value, onChange, error, helperText, icon, limit, disabled, readonly, ...props}) => {
        const Icon = icon
        return <Wrap {...props}>
            <input
                className={error ? 'editableInput error' : 'editableInput'}
                type='text'
                value={value}
                onChange={onChange}
                disabled={disabled}
                maxLength={limit}
            />
            {
                !disabled &&
                <label className='inputLable'>
                    <Icon/>
                </label>
            }
            {
                error &&
                <Error>{helperText}</Error>
            }
        </Wrap>
    }


EditableInput.defaultProps = defaultLiteTextInputProps


const StyledInput: React.ComponentType<LiteTextInputProps> = styled(EditableInput)`

.editableInput {
  background: transparent;
  padding: 10px 44px 10px 0px;
  color: ${colors.DEFAULT_BLACK};
  font-family: Roboto;
  font-size: 13px;
  line-height: 15px;
  border: none;
  border: 2px solid transparent;
  width: 100%;
  cursor: pointer;
}

.editableInput:disabled {
    color: ${colors.SOFT_BLACK};
}


.editableInput:focus {
  color: ${colors.SIMPLE_BLACK};
  outline: none;
}

.inputLable {
  position: absolute;
  right: 10px;
  top: calc(50% - 12px);
  opacity: 0;
  color: ${colors.PRIMARY};
  font-size: 1.5em;
  cursor: pointer;
  transition: opacity .2s ease-in;
}

.inputLable:hover,
.editableInput:focus + .inputLable,
.editableInput:hover + .inputLable {
  opacity: 1;
}
`
const ReadonlyInut = ({value}) =>
    <div style={{float: 'left'}}>
        {value}
    </div>

const ResultInput = caseRender(StyledInput)
    .match(
        (props: { readonly: boolean, disabled: boolean }) => props.readonly || props.disabled,
        ReadonlyInut
    )

export default contextedInput(ResultInput)
