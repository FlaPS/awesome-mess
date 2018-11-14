import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

export type DrillRigOwnerVO = typeof DRILL_RIG_OWNER

export type DrillRigOwnerSpec = {
    drillRigOwnerId: string
}

const drillRigOwnerLang: SchemeLang = {
    singular: 'производитель',
    plural: 'производителей',
    some: 'производителя',
    name: 'производители',
    gender: 'm',
}

export const DRILL_RIG_OWNER =
    createReferenceScheme(
        'DRILL_RIG_OWNER',
        drillRigOwnerLang
    )
