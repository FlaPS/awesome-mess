import * as biz from '@local/biz'
import configurable from '@local/config'
import * as Knex from 'knex'
import * as fs from 'fs'
import {omit} from 'ramda'
import {getLogger} from '@local/logger'
import {eventStoreConfigFileName} from './constants'

const logger = getLogger('sql')

// tslint:disable-next-line
let __internalKnex: Knex

export type Event = biz.BizAction<any> & {
    masterEventId: number
    slaveEventId: number
    time: number
}

const defaultConnection = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    multipleStatements: true,
    database: 'rig_space',
}

const eventStoreConfig = {
    client: 'mysql',
    connection: defaultConnection as Partial<typeof defaultConnection>,
}


export type EventStoreConfig = typeof eventStoreConfig


const isMetaTableExist = async (knex: Knex): Promise<any> =>
    new Promise<any>((resolve, reject) => {
        knex.schema
            .hasTable('meta')
            .then(resolve)
            .catch(reject)
    })

const installSchema = (knex: Knex): Promise<any> =>
    new Promise(resolve => {
            const fileName = __dirname + '/../sql/renode_1.sql'
            logger.log('install DB', fileName)
            const raw = fs.readFileSync(fileName, 'utf-8')
            knex.raw(raw).then(resolve)
        }
    )

const getDefaultDBName = (config: EventStoreConfig) => {
    return 'rig_space'
}

export const checkDB = async (config: EventStoreConfig): Promise<Knex> => {
    let knex = Knex({
        client: 'mysql',
        connection: omit(['database'], config.connection),
    })

    const dbName = config.connection.database || getDefaultDBName(config)

    if (dbName === undefined) {
        logger.warn('slave key or database name is not defined, ' +
            'couldn\'t establish knex mysql connection, awaiting for slave key')
        return undefined
    }

    await knex.raw(`CREATE DATABASE  IF NOT EXISTS ${dbName}`)

    knex = Knex({
        client: 'mysql',
        connection: config.connection,
    })

    try {
        if (!(await isMetaTableExist(knex))) {
            logger.warn('Структура базы данных не соответствует ожидаемой, установка схемы базы даных')
            await installSchema(knex)
        }
    } catch (error) {
        logger.log(error['code'])
        switch (error['code']) {
            case 'ER_BAD_DB_ERROR':
                logger.error(
                    `База данных с именем ${config.connection.database} не найдена. Укажите верное имя базы данных`
                )
                break
            case 'ER_ACCESS_DENIED_ERROR':
                logger.error('Неверные логин и пароль базы даных')
                break
            default:
                logger.error('Ошибка ' + error['code'] + JSON.stringify(error))
                break
        }
    }
    logger.log('Валидация базы данных завершена успешно')

    return knex
}

export const destoryKnex = () =>
    __internalKnex.destroy().error(logger.warn)

export const initializeKnex = async (config: EventStoreConfig = eventStoreConfig): Promise<Knex> => {

    if (__internalKnex)
        try {
            destoryKnex()
        } catch (e) {
            logger.warn('Could not correctly close knex connection on relaunch')
        }

    return __internalKnex = await checkDB(config)
}

export default configurable(eventStoreConfigFileName)(initializeKnex)(eventStoreConfig) as any as () => Promise<Knex>

