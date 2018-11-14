import * as React from 'react'
import props from '../../smart/props'
import {JOB, JobVO} from '@local/biz'
import Fab from '../../controls/Fab'
import Library from '../../styles/SVGLibrary'

import {viewGridHeader} from '../../grids/grid/gridElements'
import PageLayout from '../../layout/PageLayout'
import {Pure} from '../../smart/Pure'
import {dispatch} from '../../store/'
import routes from './index'
import {push} from 'react-router-redux'
import {RawAllJobGrid} from './jobParts'
import AddAnyJobDialog from './AddAnyJobDialog'

const GodsGrid = props(RawAllJobGrid)
    .connectProp('data', JOB.asList)
    .defaultProp('onRowClick', (e: JobVO) =>
        dispatch(push(routes.job.index.get({
            rigId: e.rigId,
            jobId: e.jobId,

        })))
    )

const Card = Pure()
    .of(GodsGrid)
    .contramap(viewGridHeader)

const Page = Pure()
    .addState<{ open: boolean }>({open: false})
    .ap(
        props =>
            <PageLayout>
                <AddAnyJobDialog
                    open={props.open}
                    onClose={() => props.setState({open: false})}
                />
                <Card
                    title={'Мероприятия'}
                />
                <Fab
                    onClick={
                        () => {
                            ;
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
