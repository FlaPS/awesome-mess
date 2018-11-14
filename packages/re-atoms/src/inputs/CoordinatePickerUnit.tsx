import * as React from 'react'
import styled from 'styled-components'
import {Font, restyle} from '../styles'
import Div from '../layout/Div'
import Library from '../styles/SVGLibrary'
import DropDownMenu from '../controls/DropdownMenu'
import IconButton from 'material-ui/IconButton'
import Input, {InputLabel} from 'material-ui/Input'
import {DEEP_BLUE, default as colors, DEFAULT_BLACK, EXTRA_SOFT_BLACK, SOFT_BLACK, TRANSPARENT} from '../styles/colors'


export enum CoordinateType {
    dms = 'dms',
    ddm = 'ddm',
    ddd = 'ddd',
}

export enum CoordPickerType {
    longitude = 'longitude',
    latitude = 'latitude',
}

export type CoordinatePickerUnitProps = {
    value: string,
    pickerType: CoordPickerType,
    onChange: (value: string) => any
    coordinateType?: CoordinateType
    onCoordinateTypeChange?: (type: CoordinateType) => void
}

type CoordinatePickerUnitState = {
    coordinateType: CoordinateType
    value: number
    option: number
    focused: boolean
}

const LabelRow = restyle`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`(Div)

const ToggleButton = Font.FontFamily(styled.button`
    color: ${({active}) => active ? DEEP_BLUE : SOFT_BLACK};
    background: none;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 20px;
    margin-left: 8px;
    padding: 0 14px;
    height: 26px;
    outline: none;
    display: flex;
    align-items: center;
    text-align: center;
    border: 1px solid ${({active}) => active ? DEEP_BLUE : TRANSPARENT};
    border-radius: 2px;
    cursor: pointer;

    &:disabled {
        cursor: default;
        color: ${EXTRA_SOFT_BLACK};
    }
`)

const ToggleButtonContainer = restyle`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${SOFT_BLACK};
    font-family: Roboto;
    font-size: 12px;
`(Div)

export const CoordinatePickerUnitContainer = restyle`
    width: 100%;
`(Div)

const PickerRowContainer = restyle`
    height: 56px;
    overflow: hidden;
    border-radius: 4px;
`(Div)

const PickerRow = restyle`
    padding: 0 12px 0 16px;
    display: flex;
    height: 56px;
    align-items: flex-end;
    background-color: ${colors.HEAVY_LIGHT_GRAY};
    position: relative;
    justify-content: space-between;

    &:after {
        content: '';
        height: 2px;
        bottom: 0;
        left: 0;
        position: absolute;
        background-color: ${props => props.focused ? colors.DEEP_BLUE : colors.UNDERLINE_GRAY};
        width: 100%;
    }
`(Div)

const DropDownText = Font.FontFamily(styled.span`
    color: ${DEFAULT_BLACK};
    font-size: 15px;
    margin-right: 32px;
`)

const DegreeInput = restyle`
    width: 77px!important;

    &::before {
        color: transparent!important;
    }
`(Input)

const MinuteInput = restyle`
    width: 72px !important;
`(Input)

const SecondsInput = restyle`
    width: 76px !important;
`(Input)

const PickerLabel = restyle`
    position: absolute;
    top: ${props => props.shrink ? '10px' : '21px'};
    color: ${props => props.focused ? colors.DEEP_BLUE : colors.SOFT_BLACK}!important;
    transition: top 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
`(InputLabel)

export const computeDDDDegrees = value => {
    if (!value && value !== 0)
        return ''
    const degrees = value / 3600000

    const delimPosition = degrees.toString().indexOf('.')

    if (delimPosition === -1)
        return (degrees + 0.00001).toFixed(1)

    return degrees.toString().length > 7 ? degrees.toFixed(4) : degrees

}

export const computeDDMMinutes = value => {
    if (!value && value !== 0)
        return ''
    let minutes = value % 3600000
    minutes = minutes / 60000

    const delimPosition = minutes.toString().indexOf('.')

    if (delimPosition === -1)
        return (`${minutes}.0 `)

    return minutes.toString().length > 7 ? Math.round(minutes * Math.pow(10, 4)) / Math.pow(10, 4) : minutes
}

export const computeDDMDegrees = value =>
    (value || value === 0) ?
        Math.floor(value / 3600000)
        : ''

export const computeDMSSeconds =
    value => (value || value === 0) ? (value % 3600000 % 60000 / 1000).toFixed(1) : ''

export const getCoordPickerName = (pickerType: CoordPickerType) =>
    pickerType === CoordPickerType.latitude
        ? 'Широта'
        : 'Долгота'

export const getFirstOptCoordType = (pickerType: CoordPickerType) =>
    pickerType === CoordPickerType.latitude
        ? 'с.ш.'
        : 'в.д.'

export const getSecondOptCoordType = (pickerType: CoordPickerType) =>
    pickerType === CoordPickerType.latitude
        ? 'ю.ш.'
        : 'з.д.'

class CoordinatePickerUnit extends React.Component<CoordinatePickerUnitProps, CoordinatePickerUnitState> {
    static defaultProps = {
        coordinateType: CoordinateType.dms,
        focused: false,
    }
    onValueChangeCb = (value: number) =>
        this.props.onChange(
            this.state.option === 1 ?
                value.toString() :
                (0 - value).toString()
        )
    onCoordTypeChangeCb = (type: CoordinateType) => {
        if (this.props.onCoordinateTypeChange)
            this.props.onCoordinateTypeChange(type)
        else
            this.setState({coordinateType: type})
    }
    renderLabel = () =>
        <LabelRow>
            <InputLabel shrink={this.state.value || this.state.focused}>
                {getCoordPickerName(this.props.pickerType)}
            </InputLabel>
            <ToggleButtonContainer>
                <ToggleButton
                    active={this.state.option === 1}
                    onClick={() => {
                        this.props.onChange(this.state.value.toString())
                        this.setState({option: 1})
                    }}
                >
                    {getFirstOptCoordType(this.props.pickerType)}
                </ToggleButton>

                <ToggleButton
                    active={this.state.option === 2}
                    onClick={() => {
                        this.props.onChange((0 - this.state.value).toString())
                        this.setState({option: 2})
                    }}
                >
                    {getSecondOptCoordType(this.props.pickerType)}
                </ToggleButton>
            </ToggleButtonContainer>
        </LabelRow>
    onDropDownItemClick = (type: CoordinateType) => {
        this.onCoordTypeChangeCb(type)
    }
    getDropDownMenuData = () => [{
        renderLabel: () => <DropDownText>Градусы, Минуты, Секунды</DropDownText>,
        onChange: () => this.onDropDownItemClick(CoordinateType.dms),
    }, {
        renderLabel: () => <DropDownText>Градусы, Десятичные минуты</DropDownText>,
        onChange: () => this.onDropDownItemClick(CoordinateType.ddm),
    }, {
        renderLabel: () => <DropDownText>Десятичные градусы</DropDownText>,
        onChange: () => this.onDropDownItemClick(CoordinateType.ddd),
    }]
    renderPickerRow = () =>
        <PickerRowContainer>
            <PickerRow focused={this.state.focused} readonly={this.props.readonly}>

                <span>{this.renderPickerInputs()}</span>

                <DropDownMenu data={this.getDropDownMenuData()}>
                    <IconButton style={{marginRight: '-12px', marginBottom: '4px'}}>
                        <Library.DropdownDown/>
                    </IconButton>
                </DropDownMenu>

            </PickerRow>
        </PickerRowContainer>
    renderDMS = () =>
        <span
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
        >
            <PickerLabel
                focused={this.state.focused}
                shrink={this.state.value || this.state.value === 0 || this.state.focused}
            >
                Градусы °
            </PickerLabel>
            <DegreeInput
                disableUnderline
                value={computeDDMDegrees(this.state.value)}
                placeholder={this.state.focused ? 'Градусы °' : ''}
                onChange={this.handleDDMDegreeChange}
            />
            <PickerLabel
                focused={this.state.focused}
                shrink={this.state.value || this.state.value === 0 || this.state.focused}
            >
                Минуты '
            </PickerLabel>
            <MinuteInput
                disableUnderline
                value={this.state.value || this.state.value === 0
                    ? Math.trunc(computeDDMMinutes(this.state.value))
                    : ''
                }
                placeholder={this.state.focused ? 'Минуты \'' : ''}
                onChange={this.handleDMSMinutesChange}
            />
            <PickerLabel
                focused={this.state.focused}
                shrink={this.state.value || this.state.value === 0 || this.state.focused}
            >
                Секунды ''
            </PickerLabel>
            <SecondsInput
                disableUnderline
                value={computeDMSSeconds(this.state.value)}
                placeholder={this.state.focused ? 'Секунды \'\'' : ''}
                onChange={this.handleDMSSecondChange}
            />
        </span>
    renderDDM = () =>
        <span
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
        >
            <PickerLabel
                focused={this.state.focused}
                shrink={this.state.value || this.state.value === 0 || this.state.focused}
            >
                Градусы °
            </PickerLabel>
            <DegreeInput
                disableUnderline
                onChange={this.handleDDMDegreeChange}
                placeholder={this.state.focused ? 'Градусы °' : ''}
                value={computeDDMDegrees(this.state.value)}
            />
            <PickerLabel
                focused={this.state.focused}
                shrink={this.state.value || this.state.value === 0 || this.state.focused}
            >
                Минуты '
            </PickerLabel>
            <MinuteInput
                disableUnderline
                placeholder={this.state.focused ? 'Минуты \'' : ''}
                value={computeDDMMinutes(this.state.value)}
                onChange={this.handleDDMMinutesChange}
            />
        </span>
    renderDDD = () =>
        <span
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
        >
            <PickerLabel
                focused={this.state.focused}
                shrink={this.state.value || this.state.value === 0 || this.state.focused}
            >
                Градусы °
            </PickerLabel>
            <DegreeInput
                onChange={this.handleDDDChange}
                disableUnderline={true}
                placeholder={this.state.focused ? 'Градусы °' : ''}
                value={computeDDDDegrees(this.state.value)}
            />
        </span>
    renderPickerInputs = () =>
        this.state.coordinateType === CoordinateType.ddd ?
            this.renderDDD() :
            this.state.coordinateType === CoordinateType.ddm ?
                this.renderDDM() :
                this.renderDMS()
    handleDDDChange = e => {
        let value = e.target.value.replace(',', '.')
        value = this.roundWithPrecision(5, value)
        const controlValue = this.props.pickerType === CoordPickerType.latitude ? 90 : 180
        const result = value >= controlValue
            ? Math.floor(controlValue * 3600000)
            : Math.floor(value * 3600000)

        this.onValueChangeCb(result)
        this.setState({value: result})
    }
    handleDDMDegreeChange = e => {
        let value = e.target.value ? parseInt(e.target.value, 10) : 0
        const controlValue = this.props.pickerType === CoordPickerType.latitude ? 90 : 180
        const oldMinutes = this.state.value ? this.state.value % 3600000 : 0
        if (value > controlValue)
            value = oldMinutes === 0 ? controlValue : controlValue - 1
        this.onValueChangeCb(oldMinutes + value * 3600000)
        this.setState({value: oldMinutes + value * 3600000})
    }
    roundDegrees = (value: number) => {
        if (this.state.value) {
            const controlValue = this.props.pickerType === CoordPickerType.latitude ? 90 : 180
            const currCoords = this.state.value
            const oldMinutesAndSeconds = currCoords - Math.floor(currCoords).toFixed(8)

            return value >= controlValue ?
                oldMinutesAndSeconds > 0 ?
                    controlValue - 1 :
                    controlValue
                : Math.floor(value)
        }
        return value
    }
    handleDDMMinutesChange = e => {
        let newMinutes = e.target.value ? e.target.value.replace(/[^0-9$.]/g, '') : 0
        newMinutes = this.roundWithPrecision(4, (this.removeExtraCommas(newMinutes)))
        const degrees = this.state.value ? Math.floor(this.state.value / 3600000) * 3600000 : 0
        const newValue = degrees + Math.floor(newMinutes * 60000)
        this.onValueChangeCb(newValue)
        this.setState({value: newValue})
    }
    handleDMSSecondChange = e => {
        let newSeconds = e.target.value ? e.target.value.replace(/[^0-9$.]/g, '') : 0
        newSeconds = this.roundWithPrecision(1, (this.removeExtraCommas(newSeconds)))
        if (!this.state.value) {
            this.setState({value: newSeconds * 1000})
            return
        }
        const degrees = Math.trunc(this.state.value / 3600000) * 3600000
        const minutes = this.state.value % 3600000 - this.state.value % 3600000 % 60000
        const newValue = degrees + minutes + newSeconds * 1000
        this.onValueChangeCb(newValue)
        this.setState({value: newValue})
    }
    handleDMSMinutesChange = e => {
        const newMinutes =
            isNaN(parseInt(e.target.value, 10))
                ? 0
                : parseInt(e.target.value, 10) > 59
                ? 59
                : parseInt(e.target.value, 10)

        const seconds = this.state.value ? this.state.value % 3600000 % 60000 : 0
        const minutesToAdd = newMinutes * 60000
        const degrees = this.state.value ? Math.trunc(this.state.value / 3600000) * 3600000 : 0
        const newValue = (degrees + minutesToAdd + seconds)
        this.onValueChangeCb(newValue)
        this.setState({value: newValue})
    }
    roundToLastActualFract = (value: number, decPoint?: number) => {
        const firstPrecisionRound = decPoint ? value.toFixed(decPoint) : value.toFixed(6)
        let maxFract =
            firstPrecisionRound.toString().indexOf('.') > -1
                ? firstPrecisionRound.toString().split('.')[1].length
                : 0
        while (maxFract > 0)
            if (firstPrecisionRound.toString().split('.')[1][maxFract - 1] === '0')
                maxFract--
            else
                break

        return value.toFixed(maxFract)
    }
    removeExtraCommas = (value: string) => {
        let newValue = value
        if (newValue.split('.').length > 2) {
            const integerPart = newValue.split('.')[0]
            const fractPart = newValue.split('.').slice(1).join('')
            newValue = `${integerPart}.${fractPart}`
        }
        return newValue
    }
    roundWithPrecision = (maxFractLength: number, value: string,) => {
        let newValue = value
        if (newValue.split('.').length > 1 && newValue.split('.')[1].length > maxFractLength) {
            const integerPart = newValue.split('.')[0]
            const fractPart = newValue.split('.')[1].slice(0, -1)
            newValue = `${integerPart}.${fractPart}`
        }
        return newValue
    }

    constructor(props) {
        super(props)

        this.state = {
            coordinateType: props.coordinateType,
            value: Math.abs(parseFloat(props.value)),
            option: isNaN(parseFloat(props.value)) || parseFloat(props.value) >= 0 ? 1 : 2,
            focused: false,
        }
    }

    componentWillReceiveProps(nextProps: CoordinatePickerUnitProps) {
        const {coordinateType} = nextProps
        if (coordinateType !== this.state.coordinateType)
            this.setState({coordinateType})
    }

    render() {
        return (
            <CoordinatePickerUnitContainer>
                {this.renderLabel()}
                {this.renderPickerRow()}
            </CoordinatePickerUnitContainer>
        )
    }
}


export default CoordinatePickerUnit
