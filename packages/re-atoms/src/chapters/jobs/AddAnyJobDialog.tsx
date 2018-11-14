import * as React from 'react'
import {JOB, JobVO} from '@local/biz'
import Dialog, {DialogActions, DialogTitle,} from 'material-ui/Dialog'
import {Pure} from '../../smart/Pure'
import {Button} from '../../controls'
import {dispatch} from '../../store/'
import jobRoutes from './index'
import {generateGuid} from '@local/random'
import JobFullForm from './JobFullForm'


const createJob = (job: JobVO) => {
    const spec = {jobId: generateGuid()}
    job = {...job, ...spec}
    const action = JOB.create(job, job)
    dispatch(action)

    jobRoutes.job.index.push(job)

}

export default Pure<{ open: boolean, onClose: () => any }>()
    .addState<{ job?: Partial<JobVO>, enabled?: boolean }>({job: {}, enabled: false})
    .ap(props =>
        <Dialog onClose={props.onClose} open={props.open} fullWidth>
            <DialogTitle>Создать новое мероприятие</DialogTitle>
            <JobFullForm
                onlyTouchedErrors
                model={props.job || {}}
                forked={true}
                onValid={job => props.setState({enabled: true, job})}
                onInvalid={job => props.setState({enabled: false, job})}
            />
            <DialogActions>
                <Button onClick={props.onClose}>
                    Отмена
                </Button>
                <Button
                    onClick={() => createJob(props.job as JobVO)}
                    disabled={!props.enabled}
                >
                    Создать мероприятие
                </Button>
            </DialogActions>
        </Dialog>
    )