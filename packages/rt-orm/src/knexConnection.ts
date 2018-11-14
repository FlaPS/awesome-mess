import * as Knex from 'knex'
import {omit} from 'ramda'
import {getLogger} from '@local/logger'

const logger = getLogger('orm')
let knex: Knex

export const defaultConfig = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        multipleStatements: true,
        database: 'rt_orm',
    },
}

export const initializeKnex = async (config: typeof defaultConfig = defaultConfig) => {

    if (knex)
        try {
            await knex.destroy()
        } catch (e) {
            logger.error('Could not correctly close knex connection on relaunch')
        }

    const noDBsafeConfig = {...config, connection: {...omit(['database'], config.connection)}}

    knex = Knex(noDBsafeConfig)

    try {
        await installDb(config.connection.database)
        await knex.destroy()
        knex = Knex(config)
    } catch (e) {
        logger.error(`error on creating database and setting new knex : ${e.toString()}`)
    }

    try {
        await knex.raw('select 1+1 as result')
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
    logger.log('knex inited')
}


const installDb = async (dbName: string = 'rt_orm') =>
    await knex.raw(`
    DROP DATABASE IF EXISTS \`${dbName}\`;
    CREATE DATABASE \`${dbName}\` DEFAULT CHARACTER SET utf8 ;`)

export const getKnex = (): Knex => {
    if (knex === undefined)
        throw new Error('Knex is not initialized')
    return knex
}
