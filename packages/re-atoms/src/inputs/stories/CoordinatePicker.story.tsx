import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {HBox} from '../../layout/index'
import CoordinatePickerUnit, {CoordPickerType} from '../CoordinatePickerUnit'
import CoordinatePicker from '../CoordinatePicker'
import {WHITE} from '../../styles/colors'
import Paper from '../../layout/Paper'

declare const module
storiesOf('Inputs/CoordinatePicker', module)
    .add('coordinate picker units', () =>
        <HBox>
            <div style={{backgroundColor: WHITE, padding: 20}}>
                <CoordinatePickerUnit
                    value=''
                    pickerType={CoordPickerType.latitude}
                    onChange={action('Latitude changes')}
                />
            </div>

            <div style={{backgroundColor: WHITE, padding: 20}}>
                <CoordinatePickerUnit
                    value=''
                    pickerType={CoordPickerType.longitude}
                    onChange={action('Longitude changes')}
                />
            </div>
        </HBox>
    )
    .add('coordinate picker', () =>
        <Paper>
            <HBox gap={24} style={{backgroundColor: WHITE, padding: 20}}>
                <CoordinatePicker value={{}} onChange={action('Coordinates changes')}/>
            </HBox>
        </Paper>
    )
