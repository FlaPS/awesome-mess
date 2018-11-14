import {createScheme} from '../core/Scheme'
import {DRILL_RIG_TYPE} from '../references/DrillRigType'
import {DRILL_RIG_OWNER} from '../references/DrillRigOwner'
import {valueTypes} from '../core/valueTypes'
import * as props from '../core/properties'
import {KeyBuilder} from '../core/KeyBuilder'

export const DRILL_RIG = createScheme({
    name: 'DRILL_RIG',
    keyBuilder: new KeyBuilder().increment('drillRigId'),
    lang: {
        singular: 'буровая установка',
        some: 'буровой установки',
        plural: 'буровых установок',
        name: 'буровые установки',
        gender: 'f',
    },
    properties: {

        serialNumber: valueTypes.string({
            required: true,
        }),
        manufacturer: valueTypes.string({
            required: true,
        }),
        productionYear: valueTypes.string({
            required: true,
        }),
        ownerId: valueTypes.itemOf({
            required: true,
            schemeName: 'DRILL_RIG_OWNER',
        }),
        typeId: valueTypes.itemOf({
            required: true,
            schemeName: 'DRILL_RIG_TYPE',
        }),
        rigWinchTypeId: valueTypes.itemOf({
            schemeName: 'RIG_WINCH_TYPE',
        }),
        capacity: valueTypes.number(),
        drillingCementComplex: valueTypes.string(),
        name: props.name,
        creationDate: props.creationDate,
        creatorUserId: props.creatorUserId,
    },
})


export type DrillRigVO = typeof DRILL_RIG.item
