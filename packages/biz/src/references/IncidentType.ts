import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

export type IncidentTypeVO = typeof INCIDENT_TYPE.item

export type IncidentTypeSpec = {
    incidentTypeId: string
}

const IncidentTypeLang: SchemeLang = {
    singular: 'НПВ',
    plural: 'НПВ',
    some: 'НПВ',
    name: 'НПВ',
    gender: 'n',
}

export const INCIDENT_TYPE = createReferenceScheme('INCIDENT_TYPE',
    IncidentTypeLang)
