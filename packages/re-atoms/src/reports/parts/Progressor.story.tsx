import * as React from 'react'
import {storiesOf} from '@storybook/react'
import Progressor from './Progressor'
import colors from '../../styles/colors'

declare const module
storiesOf('reports/parts/progressor', module)
    .add('simple bar', () =>
        <div style={{width: '50%', marginLeft: '10px'}}>
            <Progressor value={0.5} label={'Рапорт готов на 50%'}/>
        </div>
    )
    .add('custom color bar', () =>
        <div style={{width: '50%', marginLeft: '10px'}}>
            <Progressor color={colors.EXTRA_LIGHT_RED} value={0.5} label={'Рапорт готов на 50%'}/>
        </div>
    )
    .add('bar with no label', () =>
        <div style={{width: '50%', marginLeft: '10px'}}>
            <Progressor value={0.7}/>
        </div>
    )
    .add('collapsed progressor > 50%', () =>
        <div style={{width: '200px', marginLeft: '10px'}}>
            <Progressor collapsed={true} value={0.8}/>
        </div>
    )
    .add('collapsed progressor < 50%', () =>
        <div style={{width: '200px', marginLeft: '10px'}}>
            <Progressor color={colors.PALE_VIOLET_RED} collapsed={true} value={0.2}/>
        </div>
    )
