import * as React from 'react'
import {DateRangeVO} from '@local/biz'
import {restyle} from '../styles/restyle'
import Div from '../layout/Div'
import * as moment from 'moment'
import DateInput from './DateInput'

type DateRangePickerProps = DateRangeVO & {
    onChange: (newRange: DateRangeVO) => void,
    required?: boolean,
}

const FlexContainer = restyle`
    display: flex;
    flex-direction: row;
`(Div)

export class DateRangePicker extends React.Component <DateRangePickerProps, DateRangeVO> {
    onStartChange = value => {

        this.setState(
            {start: value ? moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD') : undefined},
            () => this.props.onChange({...this.state})
        )
    }
    onEndChange = value =>
        this.setState(
            {end: value ? moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD') : undefined},
            () => this.props.onChange({...this.state})
        )

    constructor(props) {
        super(props)
        this.state = {
            start: this.props.start,
            end: this.props.end,
        }
    }

    render() {
        return <FlexContainer>
            <div style={{marginRight: '24px'}}>
                <DateInput
                    value={this.state.start && moment(this.state.start).format('YYYY-MM-DD')}
                    error={this.props.required && !this.state.start}
                    label={this.props.required && !this.state.start ? 'Необходимо ввести дату начала' : 'Дата начала'}
                    onChange={this.onStartChange}

                />
            </div>
            <DateInput
                value={this.state.end && moment(this.state.end).format('YYYY-MM-DD')}
                label={moment(this.state.end)
                    .isBefore(moment(this.state.start))
                    ? 'Дата окончания меньше даты начала'
                    : 'Дата окончания'}
                error={moment(this.state.end).isBefore(moment(this.state.start))}
                onChange={this.onEndChange}
            />
        </FlexContainer>
    }
}
