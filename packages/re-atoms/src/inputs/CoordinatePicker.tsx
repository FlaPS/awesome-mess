import * as React from 'react'

import CoordinatePickerUnit, {
    CoordinatePickerUnitProps,
    CoordinateType as CType,
    CoordPickerType as PType
} from './CoordinatePickerUnit'
import contextedInput, {InputCtx} from './contextedInput'
import caseRender from '../smart/caseRender'
import CoordinatePickerReadonly from './CoordinatePickerReadonly'

export type Coordinates = {
    latitude: string
    longitude: string
    coordinateType: CType
}

type CoordinatePickerProps = InputCtx & {
    value: Coordinates
    onChange: (value: Coordinates) => void
    coordinateType?: CType
}

const onCoordsTypeChange = ({onChange, value}) => coordinateType =>
    onChange({...value, coordinateType})

const getValue = ({value}) => (pType: PType) =>
    value
        ? value[pType]
        : ''

const getType =
    ({value}: CoordinatePickerProps) =>
        value
            ? value.coordinateType
            : CType.dms

const onChange =
    ({onChange, value}: CoordinatePickerProps) =>
        (pType: PType) => (newValue: string) =>
            onChange({...value, [pType]: newValue})

const getUnitProps =
    (type: PType) =>
        (props: CoordinatePickerProps): CoordinatePickerUnitProps & { key: PType } => ({
            key: type,
            pickerType: type,
            onChange: onChange(props)(type),
            value: getValue(props)(type),
            coordinateType: getType(props),
            onCoordinateTypeChange: onCoordsTypeChange(props),
        })

const Picker = (props: CoordinatePickerProps) => [
    // tslint:disable:jsx-key
    <CoordinatePickerUnit {...getUnitProps(PType.latitude)(props)} />,
    <CoordinatePickerUnit {...getUnitProps(PType.longitude)(props)} />,
    // tslint:enable:jsx-key
]

const ReadonlyPicker = (props: CoordinatePickerProps) => [
    // tslint:disable:jsx-key
    <CoordinatePickerReadonly {...getUnitProps(PType.latitude)(props)} />,
    <CoordinatePickerReadonly {...getUnitProps(PType.longitude)(props)} />,
    // tslint:enable:jsx-key
]

const PickerBranched = caseRender(Picker)
    .match((props: { readonly: boolean }) => props.readonly, ReadonlyPicker)

export default contextedInput(PickerBranched)
