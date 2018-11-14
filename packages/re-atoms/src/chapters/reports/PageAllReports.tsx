import * as React from 'react'
import props from '../../smart/props'
import {REPORT, ReportVO} from '@local/biz'
import {RawAllReports} from './reportParts'
import Fab from '../../controls/Fab'
import Library from '../../styles/SVGLibrary'

import {viewGridHeader} from '../../grids/grid/gridElements'
import PageLayout from '../../layout/PageLayout'
import {Pure} from '../../smart/Pure'
import {dispatch} from '../../store/'
import routes from './index'
import {push} from 'react-router-redux'
import AddAnyReportDialog from './AddAnyReportDialog'


const ReportsGrid = props(RawAllReports)
    .connectProp('data', REPORT.asList)
    .defaultProp('onRowClick', (e: ReportVO) =>
        dispatch(push(routes.report.index.get({
            rigId: e.rigId,
            reportDate: e.reportDate,
            reportFormId: e.reportFormId,
        })))
    )

const Card = Pure()
    .of(ReportsGrid)
    .contramap(viewGridHeader)


const Page = Pure()
    .addState<{ open: boolean }>({open: false})
    .ap(
        props =>
            <PageLayout>
                <AddAnyReportDialog
                    open={props.open}
                    onClose={() => props.setState({open: false})}
                />
                <Card
                    title={'Рапорты'}

                />
                <Fab
                    onClick={
                        () => {
                            props.setState({open: true})
                        }
                    }
                >
                    <Library.Add
                    />
                </Fab>
            </PageLayout>
    )

export default Page
