import {StateWithBiz} from '../BizState'

export default slaveRigId => (state: StateWithBiz): StateWithBiz => {
    const {rigId, wellId, ...rest} = state.biz
    return {
        biz: {
            ...rest,
            wellId: {[slaveRigId]: wellId[slaveRigId]},
            rigId: {[slaveRigId]: rigId[slaveRigId]},
        }
    }
}