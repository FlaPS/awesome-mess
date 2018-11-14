import * as Biz from '@local/biz'
import {BIZ_PREFIX, CREATED_POSTFIX} from '@local/biz'
import * as faker from 'faker'
import {toIndexedArray} from '@local/utils'


export const generateAction = () => {
    const refSchemes = toIndexedArray(Biz.schemes).filter(
        scheme => scheme.isReference
    )

    const randomScheme = Math.floor(Math.random() * refSchemes.length)

    return {
        type: BIZ_PREFIX + refSchemes[randomScheme].actionPrefix + CREATED_POSTFIX,
        payload:
            {
                patch: {
                    [refSchemes[randomScheme].uniqueProperty]: faker.random.number(),
                    name: faker.company.bsNoun(),
                    creationDate: new Date(),
                },
            },
    }
}
