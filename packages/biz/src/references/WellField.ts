import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'


const wellFieldLang: SchemeLang = {
    singular: 'месторождение',
    plural: 'месторождений',
    some: 'месторождения',
    name: 'месторождения',
    gender: 'n',
}

export const WELL_FIELD =
    createReferenceScheme(
        'WELL_FIELD',
        wellFieldLang
    )

export type WellFieldVO = typeof WELL_FIELD.item
