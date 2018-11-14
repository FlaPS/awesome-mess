import * as React from 'react'
import Tabs from '../../controls/TabsRouted'
import RoutedPage from '../../smart/RoutedPage'
import RadioGroup from '../../inputs/RadioGroup'
import {bindInput} from '../../smart/form/bindInput'
import {DrillRigVO} from '@local/biz'

const tabs = () => []

export const DrillingCementComplexRadioGroup = props =>
    <RadioGroup
        label='БЦК'
        options={[
            {value: '1', label: 'Да'},
            {value: '0', label: 'Нет'},
        ]}
        {...bindInput('drillingCementComplex')<DrillRigVO>(props)}
    />

export default class extends RoutedPage<void, void> {
    render() {
        const isTabsVisible = tabs().find(t => t.path === this.props.location.pathname)
        return (
            <div>
                {isTabsVisible &&
                <Tabs
                    tabs={tabs()}
                />
                }
                {this.renderChildRoutes()}
            </div>
        )
    }
}

