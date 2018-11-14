import * as React from 'react'
import {REPORT, ReportVO} from '@local/biz'
import Dialog, {DialogActions, DialogTitle,} from 'material-ui/Dialog'
import {Pure} from '../../smart/Pure'
import {Button} from '../../controls'
import {dispatch} from '../../store/'
import reportRoutes from './index'
import {generateGuid} from '@local/random'
import genericForm from '../../smart/genericForm'


const NewAnyReportForm = genericForm(REPORT, ['rigId', 'reportDate', 'reportFormId'])
const createReport = (report: ReportVO) => {
    const spec = {guid: generateGuid()}
    const action = REPORT.create({...spec, ...report}, report)

    dispatch(action)
    reportRoutes.report.index.push(report)
}

export default Pure<{ open: boolean, onClose: () => any }>()
    .addState<{ report?: Partial<ReportVO>, enabled?: boolean }>({report: {}, enabled: false})
    .ap(props =>
        <Dialog onClose={props.onClose} open={props.open} fullWidth>
            <DialogTitle>Созданть новый рапорт</DialogTitle>
            <NewAnyReportForm
                onlyTouchedErrors
                model={props.report || {}}
                forked={true}
                onValid={report => props.setState({enabled: true, report})}
                onInvalid={report => props.setState({enabled: false, report})}
            />
            <DialogActions>
                <Button onClick={props.onClose}>
                    Отмена
                </Button>
                <Button
                    onClick={() => createReport(props.report as ReportVO)}
                    disabled={!props.enabled}
                >
                    Создать рапорт
                </Button>
            </DialogActions>
        </Dialog>
    )