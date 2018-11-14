import {KeyBuilder} from '../core/KeyBuilder'

import {createScheme} from '../core/Scheme'
import {valueTypes} from '../core/valueTypes'
import * as properties from '../core/properties'

export const APPLICATION = createScheme({
    name: 'APPLICATION',
    actionPrefix: 'APPLICATION',
    keyBuilder: new KeyBuilder().externalkey('rigId', 'wellId').date('applicationDate'),
    lang: {
        singular: 'комментарии и заявки',
        plural: 'комментарии и заявки',
        some: 'комментарии и заявки',
        name: 'комментарии и заявки',
    },
    properties: {
        rigId: valueTypes.itemOf({
            schemeName: 'WELL',
            required: true,
            sealed: true,
        }),
        applicationDate: valueTypes.date({
            required: true,
            sealed: true,
        }),
        supervisorComment: valueTypes.string({
            langRU: 'Комментарий супервайзера',
        }),
        drillingForemanComment: valueTypes.string({
            langRU: 'Комментарий бурового мастера',
        }),
        creationDate: properties.creationDate,
        creatorUserId: properties.creatorUserId,
    },
})

export type ApplicationVO = typeof APPLICATION.item
