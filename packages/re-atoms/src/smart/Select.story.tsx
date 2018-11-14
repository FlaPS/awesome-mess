import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import Switch from '../inputs/Switch'
import makeSelect from './makeValue'
import {defaultProps} from 'recompose'


type Item = {
    label: string;
    value: number
}
const items: Item[] = [
    {label: 'A', value: 2},
    {label: 'B', value: 5},
    {label: 'C', value: 9},
]

const Select = makeSelect<Item>()

declare const module
storiesOf('PureSelect', module)
    .add('select an item ', () =>
        <Select items={items} value={items[0]} onChange={action('Effect for value')}>
            {
                props => {
                    action('render with')(props)
                    return <div>{items.map(item =>
                        <Switch
                            key={item.value}
                            label={item.label}
                            value={item === props.value}
                            onClick={() => props.onChange(item)}
                        />
                    )}
                    </div>
                }
            }
        </Select>
    )
