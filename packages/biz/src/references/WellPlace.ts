import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

export type WellPlaceVO = typeof WELL_PLACE.item

export type WellPlaceSpec = {
    wellPlaceId: string
}

const wellPlaceLang: SchemeLang = {
    singular: 'площадь',
    plural: 'площадей',
    some: 'площади',
    name: 'площади',
    gender: 'f',
}

export const WELL_PLACE =
    createReferenceScheme(
        'WELL_PLACE',
        wellPlaceLang
    )
