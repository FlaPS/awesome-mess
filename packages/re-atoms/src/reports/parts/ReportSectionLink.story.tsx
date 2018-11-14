import * as React from 'react'
import ReportSectionLink from './ReportSectionLink'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import Library from '../../styles/SVGLibrary'

declare const module

storiesOf('reports/parts/ReportSectionLink', module)
    .add('simple link', () =>
        <ReportSectionLink isHeader={false} label={'simple link'} sectionKey={'1'} onClick={key => console.log(key)}/>)
    .add('header link', () =>
        <div style={{padding: '25px'}}>
            <ReportSectionLink
                isHeader={true}
                label={'header link'}
                sectionKey={'2'}
                onClick={key => console.log(key)}
            />
        </div>)
    .add('open header link', () =>
        <ReportSectionLink
            isHeader={true}
            open={true}
            label={'open header link'}
            sectionKey={'2'}
            onClick={key => console.log(key)}
        />)
    .add('resolved header link', () =>
        <ReportSectionLink
            isHeader={true}
            resolved={true}
            label={'open header link'}
            sectionKey={'2'}
            onClick={key => console.log(key)}
        />)
    .add('3 collapsed links', () =>
        <div>
            <div style={{width: '56px'}}>
                <ReportSectionLink
                    collapsed={true}
                    icon={<Library.Buldozer/>}
                    sectionKey={'2'}
                    onClick={key => console.log(key)}
                />
            </div>
            <div style={{width: '56px'}}>
                <ReportSectionLink
                    collapsed={true}
                    isHeader={true}
                    icon={<Library.Buldozer/>}
                    sectionKey={'2'}
                    onClick={key => console.log(key)}
                />
            </div>
            <div style={{width: '56px'}}>
                <ReportSectionLink
                    collapsed={true}
                    isHeader={true}
                    open={true}
                    icon={<Library.Buldozer/>}
                    sectionKey={'2'}
                    onClick={key => console.log(key)}
                />
            </div>
            <div style={{width: '56px'}}>
                <ReportSectionLink
                    collapsed={true}
                    isHeader={true}
                    selected={true}
                    open={true}
                    icon={<Library.Buldozer/>}
                    sectionKey={'2'}
                    onClick={key => console.log(key)}
                />
            </div>
        </div>)
