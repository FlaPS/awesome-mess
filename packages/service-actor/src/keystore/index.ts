import getKnex from '../knexConnection'


const licenseTableName = 'license'

export type KeyInfo = {
    well_id: number
    license_id: number
    key: string
    last_used_milis?: number
}

export type DefaultPermissions = {
    rig: boolean
    drillingReport: boolean
}

export type Permissions<T extends DefaultPermissions> = {
    [P in keyof T]: boolean
}

const defaultPermissions: Permissions<any> = {
    rig: false,
    drillingReport: false,
}

export const createLicenseTable =
    async (permissions: Permissions<any> = defaultPermissions) => {
        const knex = await getKnex()
        await knex.schema.dropTableIfExists(licenseTableName)
        await knex.schema.createTable(licenseTableName, table => {
            table.integer('license_id').unsigned().primary()
            table.integer('well_id').unsigned()
            table.string('key').notNullable()
            table.bigInteger('last_used_milis')
            Object.keys(permissions)
                .forEach(permission => table.boolean(permission).defaultTo(permissions[permission]))
        })
    }


export const clearKeys = async () =>
    (await getKnex()).table(licenseTableName).truncate()

export const seedKeys = async (wellIds: string[] = []) => {
    const knex = await getKnex()
    const keysArray = wellIds
        .map(wellId =>
            ({
                well_id: wellId,
                key: 'w' + wellId,
                license_id: Math.round(Math.random() * 100),
            }))

    return await knex('license').insert(keysArray)
}

export const getLicenseRecordByKey = async (key: string): Promise<KeyInfo & Permissions<any> | undefined> => {
    const knex = await getKnex()
    const result = await knex.table(licenseTableName).select().where('key', key)
    return result[0]
}

export const getAllKeyInfos = async (): Promise<Array<KeyInfo & Permissions<any>>> => {
    const knex = await getKnex()
    return knex.table(licenseTableName).select()
}

export const setKeyBinding = async (key: string, wellId: string | undefined) => {
    const knex = await getKnex()
    const wellIdToDb = wellId || null
    return knex.table(licenseTableName).update({key, 'well_id': wellIdToDb})
}
