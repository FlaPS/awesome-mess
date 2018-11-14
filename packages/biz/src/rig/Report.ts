import {KeyBuilder} from '../core/KeyBuilder'

import {createScheme} from '../core/Scheme'

import {valueTypes} from '../core/valueTypes'
import * as properties from '../core/properties'


export const REPORT = createScheme({
    name: 'REPORT',
    actionPrefix: 'REPORT',
    keyBuilder: new KeyBuilder().externalkey('rigId').guid('reportGuid'),
    aclKey: 'job',
    lang: {
        singular: 'рапорт',
        plural: 'рапорты',
        some: 'рапорта',
        name: 'рапорты',
    },
    properties: {
        rigId: valueTypes.itemOf({
            schemeName: 'WELL',
            required: true,
            sealed: true,
        }),

        reportFormId: valueTypes.itemOf({
            schemeName: 'REPORT_FORM',
            required: true,
            sealed: true,
        }),
        reportDate: valueTypes.date({
            required: true,
            langRU: 'дата',
            sealed: true,
        }),


        creationDate: properties.creationDate,
        creatorUserId: properties.creatorUserId,
    },
})

export type ReportVO = typeof REPORT.item
