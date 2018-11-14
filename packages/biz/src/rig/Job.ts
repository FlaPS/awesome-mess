import {KeyBuilder} from '../core/KeyBuilder'

import {createScheme} from '../core/Scheme'

import {valueTypes} from '../core/valueTypes'
import * as properties from '../core/properties'


export type JobContractorVO = {
    contractorTypeId: string
    name: string
    contactPerson?: string
}

export const JOB = createScheme({
    name: 'JOB',
    keyBuilder: new KeyBuilder().externalkey('rigId', 'wellId').guid('jobId'),
    aclKey: 'job',
    lang: {
        singular: 'мероприятие',
        plural: 'мероприятий',
        some: 'мероприятия',
        name: 'мероприятия',
    },
    properties: {
        rigId: valueTypes.itemOf({
            schemeName: 'WELL',
            required: true,
            sealed: true,
        }),

        contractor: valueTypes.item<JobContractorVO>({
            langRU: 'подрядчик',
        }),

        reportFormIds: valueTypes.arrayOf({
            schemeName: 'REPORT_FORM',
        }),

        jobTypeId: valueTypes.itemOf({
            schemeName: 'JOB_TYPE',
            required: true,
        }),

        drillRigId: valueTypes.itemOf({
            schemeName: 'DRILL_RIG',
        }),


        planDateTimeRange: valueTypes.daterange({
//            required: true,    commented because of JOB/ADDED actions from seed dont pass validation middleware
            langRU: 'плановые даты',
        }),

        factDateTimeRange: valueTypes.daterange({
            langRU: 'фактические даты',
        }),
        creationDate: properties.creationDate,
        creatorUserId: properties.creatorUserId,
        comment: properties.comment,
    },
})

export type JobVO = typeof JOB.item

export type JobSpec = typeof JOB.spec

const s = {} as JobSpec
