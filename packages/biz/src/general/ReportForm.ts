import {createScheme} from '../core/Scheme'
import {valueTypes} from '../core/valueTypes'
import {REPORT_TYPE} from './ReportType'
import {name} from '../core/properties'
import {KeyBuilder} from '../core/KeyBuilder'


export const REPORT_FORM = createScheme({
    name: 'REPORT_FORM',
    keyBuilder: new KeyBuilder().increment('reportFormId'),
    lang: {
        singular: 'форма рапорта',
        plural: 'форм рапортов',
        some: 'формы рапортов',
        name: 'формы рапортов',
        gender: 'f',
    },
    properties: {
        name,

        reportTypeId: valueTypes.itemOf({
            required: true,
            schemeName: 'REPORT_TYPE',
        }),
    },
})

export type ReportFormVO = typeof REPORT_FORM.item
