import {JOB_TYPE} from './JobTypes'
import {createScheme} from '../core/Scheme'
import {KeyBuilder} from '../core/KeyBuilder'
import {valueTypes} from '../core/valueTypes'
import {color, name} from '../core/properties'

export const REPORT_TYPE = createScheme({
    name: 'REPORT_TYPE',
    keyBuilder: new KeyBuilder().increment('reportTypeId'),
    lang: {
        singular: 'тип рапорта',
        plural: 'типов рапортов',
        some: 'типа рапортов',
        name: 'типы рапортов',
        gender: 'm',
    },
    properties: {
        name,
        jobTypeId: valueTypes.itemOf({
            schemeName: 'JOB_TYPE',
        }),
        color,
    },
})

export type ReportTypeVO = typeof REPORT_TYPE.item

