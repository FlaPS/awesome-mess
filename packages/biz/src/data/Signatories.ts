import {createScheme, KeyBuilder, valueTypes} from '../core/'

import * as properties from '../core/properties'


export const SIGNATORIES = createScheme({
    name: 'SIGNATORIES',
    actionPrefix: 'SIGNATORIES',
    keyBuilder: new KeyBuilder().externalkey('rigId', 'wellId').date('signatureDate'),
    lang: {
        singular: 'ответственные за рапорт',
        plural: 'ответственные за рапорты',
        some: 'ответсвтенные за рапорта',
        name: 'ответственные за рапорт',
    },
    properties: {
        rigId: valueTypes.itemOf({
            schemeName: 'WELL',
            required: true,
            sealed: true,
        }),
        reportDate: valueTypes.date({
            required: true,
            sealed: true,
        }),
        supervisorName: valueTypes.string({
            langRU: 'Супервайзер',
            required: true,
        }),
        drillingForemanName: valueTypes.string({
            langRU: 'Буровой мастер',
            required: true,
        }),
        drillingForema: valueTypes.itemOf({
            langRU: 'вася',
            schemeName: 'ROLE',
        }),
        creationDate: properties.creationDate,
        creatorUserId: properties.creatorUserId,
    },
})

export type SignatoriesVO = typeof SIGNATORIES.item
