import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/Scheme'
import {valueTypes} from '../core/valueTypes'

export type IncidentKindVO = typeof INCIDENT_KIND.item

export type IncidentKindSpec = {
    incidentKindId: string
    parentId: string
}

const IncidentKindLang: SchemeLang = {
    singular: 'подвид ',
    plural: 'подвидов ',
    some: 'подвида ',
    name: 'подвиды ',
    gender: 'm',
}

export const INCIDENT_KIND =
    createReferenceScheme(
        'INCIDENT_KIND',
        IncidentKindLang,
        {
            incidentTypeId: valueTypes.itemOf({
                required: true,
                schemeName: 'INCIDENT_TYPE',
            }),
        }
    )
