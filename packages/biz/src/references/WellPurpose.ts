import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

export type WellPurposeVO = typeof WELL_PURPOSE.item

export type WellPurposeSpec = {
    wellPurposeId: string
}

const wellPurposeLang: SchemeLang = {
    singular: 'назначение',
    plural: 'назначений',
    some: 'назначения',
    name: 'назначения',
    gender: 'n',
}

export const WELL_PURPOSE =
    createReferenceScheme(
        'WELL_PURPOSE',
        wellPurposeLang
    )
