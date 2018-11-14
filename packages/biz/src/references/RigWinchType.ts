import {createReferenceScheme} from './ReferenceScheme'
import {SchemeLang} from '../core/'

const rigWinchTypeLang: SchemeLang = {
    singular: 'буровая лебедка',
    plural: 'буровых лебедок',
    some: 'буровых лебедки',
    name: 'буровые лебедки',
    gender: 'm',
}

export const RIG_WINCH_TYPE =
    createReferenceScheme(
        'RIG_WINCH_TYPE',
        rigWinchTypeLang
    )

export type RigWinchTypeVO = typeof RIG_WINCH_TYPE
