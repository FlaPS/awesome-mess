import * as React from 'react'
import PageLayout from '../../layout/PageLayout'
import SignatoriesSectionCard from './sections/SignatoriesSectionCard'


export type PageReportProps = {
    rigId: string
    reportDate: string
    reportFormId: string
}

export class PageReport extends React.Component<PageReportProps, any> {
    render() {
        return <PageLayout>
            <SignatoriesSectionCard {...this.props} />
            <div>{JSON.stringify(this.props)}</div>
        </PageLayout>
    }
}