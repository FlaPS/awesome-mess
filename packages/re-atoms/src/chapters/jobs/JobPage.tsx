import * as React from 'react'

import {JOB, JobVO} from '@local/biz'
import {PageLayout} from '../../layout/'
import JobFullForm from './JobFullForm'
import props from '../../smart/props'
import DialogEditFormUC from '../../smart/form/DialogEditFormUC'
import {dispatch} from '../../store/'


const Form = props((props: { model: JobVO, rigId: string, jobId: string }) =>
    <DialogEditFormUC
        stretch
        model={props.model}
        viewer={JobFullForm}
        onEdit={model =>
            dispatch(JOB.update({rigId: props.rigId, jobId: props.jobId}, model))
        }
    />
)
    .connectProp('model', JOB.bySpec)


export type PageReportProps = {
    rigId: string
    reportDate: string
    reportFormId: string
}


export default class JobPage extends React.Component<{ rigId, jobId }, any> {
    render() {
        return <PageLayout>
            <Form
                rigId={this.props.rigId}
                jobId={this.props.jobId}
            />

            <div>{JSON.stringify(this.props)}</div>
        </PageLayout>
    }
}
