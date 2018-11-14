import * as React from 'react'
import {restyle} from '../styles/restyle'
import colors from '../styles/colors'
import {
    computeDDDDegrees,
    computeDDMDegrees,
    computeDDMMinutes,
    computeDMSSeconds,
    CoordinatePickerUnitContainer,
    CoordinateType,
    getCoordPickerName,
    getFirstOptCoordType,
    getSecondOptCoordType
} from './CoordinatePickerUnit'
import Div from "../layout/Div";
import {default as InputReadOnly} from "./InputReadonly";

const LabelRow = restyle`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`(Div)

const PickerLabel = restyle`
    font-size: 12px;
    color: ${colors.SOFT_BLACK};
`(Div)

const CoordType = restyle`
    font-family: Roboto;
    font-size: 14px;
    margin-left: 26px;
    color: ${colors.SOFT_BLACK};
`(Div)

const ReadOnlyCoordsRow = restyle`
    display: flex;
    flex-direction: row;

    > *:not(:last-child) {
        padding-right: 10px;
    }
`(Div)

const RenderPickerRow = ({value, coordinateType}) => coordinateType === CoordinateType.ddd ?
    RenderDDD({value}) :
    coordinateType === CoordinateType.ddm ?
        RenderDDM({value}) :
        RenderDMS({value})

const RenderDMS = ({value}) =>
    <ReadOnlyCoordsRow>
        <InputReadOnly
            label={'Градусы °'}
            value={computeDDMDegrees(value).toString()}
        />
        <InputReadOnly
            label={'Минуты \''}
            value={value ? Math.trunc(computeDDMMinutes(value)).toString() : ''}
        />
        <InputReadOnly
            label={'Секунды \'\''}
            value={computeDMSSeconds(value).toString()}
        />
    </ReadOnlyCoordsRow>

const RenderDDD = ({value}) =>
    <ReadOnlyCoordsRow>
        <InputReadOnly
            label={'Градусы °'}
            value={computeDDDDegrees(value).toString()}
        />
    </ReadOnlyCoordsRow>

const RenderDDM = ({value}) =>
    <ReadOnlyCoordsRow>
        <InputReadOnly
            label={'Градусы °'}
            value={computeDDMDegrees(value).toString()}
        />
        <InputReadOnly
            label={'Минуты \''}
            value={computeDDMMinutes(value).toString()}
        />
    </ReadOnlyCoordsRow>

const CoordinatePickerReadonly = props =>
    <CoordinatePickerUnitContainer>
        {props.value ?
            <div>
                <LabelRow>
                    <PickerLabel shrink> {getCoordPickerName(props.pickerType)}</PickerLabel>
                    <CoordType>
                        {props.value > 0 ?
                            getFirstOptCoordType(props.pickerType)
                            :
                            getSecondOptCoordType(props.pickerType)}
                    </CoordType>
                </LabelRow>
                {RenderPickerRow(props)}
            </div>
            : <InputReadOnly label={getCoordPickerName(props.pickerType)}></InputReadOnly>
        }
    </CoordinatePickerUnitContainer>

export default CoordinatePickerReadonly
