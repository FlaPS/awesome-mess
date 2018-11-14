import {WELL} from '../general/Well'

import getBizTestStore from './getBizTestStore'
import slaveStateSelector from '../selectors/slaveState'

const store = getBizTestStore()
const getState = store.getState

test('Select slave state for first rig, and select one. Check that selection has only one well and rig', () => {
        const slaveId = '0'
        const masterState = getState()
        const slaveState = slaveStateSelector(slaveId)(masterState)

        expect(WELL.asList()(slaveState).length).toEqual(1)

        expect(slaveState.biz.rigId[slaveId]).toEqual(masterState.biz.rigId[slaveId])

    }
)
