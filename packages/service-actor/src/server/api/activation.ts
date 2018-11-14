import * as iso from '@local/isomorphic'
import getBackendStore from '../../getBackendStore'
import * as biz from '@local/biz'
import * as keystore from '../../keystore'

export default async (data: iso.activation.ActivationRequest): Promise<iso.activation.ActivationResponse> => {

    if (!data)
        return {
            status: 'fail',
            keyError: 'keyNotFound',
        }

    const key = data.key

    if (!key.startsWith('w'))
        return {
            status: 'fail',
            keyError: 'keyNotFound',
        }

    const keyInfo = await keystore.getLicenseRecordByKey(key)

    const wellId = keyInfo ? String(keyInfo.well_id) : undefined

    if (!wellId)
        return {
            status: 'fail',
            keyError: 'keyIsNotBinded',
        }

    const state = getBackendStore().getState()
    const well = biz.WELL.bySpec({wellId})()


    if (well) {
        let wellName
        try {
            wellName = biz.WELL.getFullName(well)(state)
        } catch (e) {
            wellName = JSON.stringify(well)
        }
        return {
            status: 'success',
            wellId: well.wellId,
            key,
            wellName,
        }
    }

    return {
        status: 'fail',
        keyError: 'keyIsNotBinded',
    }
}