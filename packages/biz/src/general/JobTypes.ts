import {KeyBuilder} from '../core/KeyBuilder'
import {createScheme} from '../core/Scheme'
import {name} from '../core/properties'


export const JOB_TYPE = createScheme({
    name: 'JOB_TYPE',
    keyBuilder: new KeyBuilder().increment('jobTypeId'),
    lang: {
        singular: 'тип мероприятия',
        plural: 'типов мероприятий',
        some: 'типа мероприятий',
        name: 'типы мероприятий',
        gender: 'm',
    },
    properties: {
        name,
    },
})

export type JobTypeVO = typeof JOB_TYPE.item
