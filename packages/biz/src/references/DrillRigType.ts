import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

export type DrillRigTypeVO = typeof DRILL_RIG_TYPE.item

export type DrillRigTypeSpec = {
    drillRigTypeId: string
}

const drillRigTypeLang: SchemeLang = {
    singular: 'тип',
    plural: 'типов',
    some: 'типа',
    name: 'типы',
    gender: 'm',
}

export const DRILL_RIG_TYPE =
    createReferenceScheme(
        'DRILL_RIG_TYPE',
        drillRigTypeLang
    )
