import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

export type WellStatusVO = typeof WELL_STATUS.item

export type WellStatusSpec = {
    wellStatusId: string
}

const wellStatusLang: SchemeLang = {
    singular: 'статус',
    some: 'статуса',
    plural: 'статусов',
    name: 'статусы',
    gender: 'm',
}

export const WELL_STATUS =
    createReferenceScheme(
        'WELL_STATUS',
        wellStatusLang
    )
