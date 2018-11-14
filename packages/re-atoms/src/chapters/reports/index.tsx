import * as React from 'react'
import makeRoute from '../makeRoute'
import PageAllReports from './PageAllReports'
import {PageReport, PageReportProps} from './PageReport'
import Library from '../../styles/SVGLibrary'
import RoutedPage from '../../smart/RoutedPage'

class ChapterReports extends RoutedPage<any> {
    render() {
        return this.renderChildRoutes()
    }
}

export default {
    index: makeRoute({
            path: '/app/reports',
            innerIndex: '/app/reports/all',
            title: 'Рапорты',
            label: 'рапорты',
            icon: <Library.Hamburger/>,
        },
        ChapterReports
    ),
    reportList: {
        index: makeRoute({
                path: '/app/reports/all',
            },
            PageAllReports
        )
    },
    report: {
        index: makeRoute({
                path: '/app/reports/report/:rigId/:reportDate/:reportFormId',
                get: (props: PageReportProps) =>
                    `/app/reports/report/${props.rigId}/${props.reportDate}/${props.reportFormId}`

            },
            PageReport
        )
    },
}
