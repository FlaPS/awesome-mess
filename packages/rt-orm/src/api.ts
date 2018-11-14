import {defaultConfig, initializeKnex} from './knexConnection'
import {initDb} from './initDb'
import {ResetAction, UpdateAction} from './ORM'
import configurable from '@local/config'
import {getLogger} from '@local/logger'

const logger = getLogger('orm')

logger.log('started')
const configure = async cfg => {
    await initializeKnex(cfg)
    await initDb()
    logger.log('db initialised')
}

const db = configurable('orm')(configure)(defaultConfig)


export const reset = async state => {
    await db()
    await ResetAction(state)
}

export const update = async action => {
    await db()
    await UpdateAction(action)
}
