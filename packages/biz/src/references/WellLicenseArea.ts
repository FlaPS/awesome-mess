import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/Scheme'
import {valueTypes} from '../core/valueTypes'

export type WellLicenseAreaVO = typeof WELL_LICENSE_AREA.item

export type WellLicenseAreaSpec = {
    wellLicenseAreaId: string
}

const wellLicenseAreaLang: SchemeLang = {
    singular: 'лицензионный участок',
    plural: 'лицензионных участков',
    some: 'лицензионных участка',
    name: 'лицензионные участки',
    gender: 'm',
}

export const WELL_LICENSE_AREA =
    createReferenceScheme(
        'WELL_LICENSE_AREA',
        wellLicenseAreaLang,
        {
            expirationDate: valueTypes.datetime(),
        }
    )

