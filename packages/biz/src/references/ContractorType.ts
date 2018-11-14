import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/Scheme'

const contractorTypeLang: SchemeLang = {
    singular: 'подрядчик',
    plural: 'подрядчиков',
    some: 'подрядчика',
    name: 'подрядчики',
    gender: 'm',
}

export const CONTRACTOR_TYPE =
    createReferenceScheme(
        'CONTRACTOR_TYPE',
        contractorTypeLang
    )

export type ContractorTypeVO = typeof CONTRACTOR_TYPE.item
