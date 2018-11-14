import * as React from 'react'
import styled from 'styled-components'
import Checkbox from 'material-ui/Checkbox'
import Radio from 'material-ui/Radio'

type SelectionCellProps = {
    selected?: boolean
    radio?: boolean
    onChange?: (value: boolean) => any
    disabled?: boolean
    inversed?: boolean
}

const RawCell = styled.td
    `
    padding-left: 24px;
    width: 24px;
    display: table-cell;
    vertical-align: middle;
`

export default (props: SelectionCellProps) =>
    <RawCell>
        {props.radio
            ? <Radio
                style={{width: '20px', height: '20px'}}
                disabled={props.disabled}
                checked={props.inversed ? !props.selected : props.selected}
                onChange={(e, v) => props.onChange(v)}

            />
            : <Checkbox
                style={{width: '24px', height: '24px'}}
                disabled={props.disabled}
                checked={props.inversed ? !props.selected : props.selected}
                onChange={(e, v) => props.onChange(v)}

            />
        }
    </RawCell>
