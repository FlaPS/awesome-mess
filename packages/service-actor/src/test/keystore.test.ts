import getKnex from '../knexConnection'

import {createLicenseTable, getLicenseRecordByKey, KeyInfo, Permissions, seedKeys, setKeyBinding} from '../keystore'


jest.setTimeout(100000)

const testConfig = {
    client: 'mysql',
    connection: {
        host: process.env.NODE_ENV === 'test_docker' ? 'mysql' : '127.0.0.1',
        user: 'root',
        password: 'tetraroot',
        multipleStatements: true,
        database: 'rig_space',
    },
}

const testPermissions: Permissions<any> = {
    testPerm1: false,
    testPerm2: true,
}

declare const test: any
declare const expect: any
declare const afterAll: any
declare const beforeAll: any
declare const jest: any


beforeAll(async done => {
    try {
        //  console.log('initing knex test')
        await getKnex()
    } catch (e) {
        //  console.log(`error when installing test db: ${e.toString()}`)
        process.exit()
    } finally {
        done()
    }
})

test('table license created', async () => {
    await createLicenseTable(testPermissions)
    const knex = await getKnex()
    const result =
        await knex.raw(
            `SELECT table_name from information_schema.tables WHERE table_schema = '${testConfig.connection.database}';`
        )
    expect(result[0].some(res => res.table_name === 'license')).toBe(true)
})

test('insert license key and check default values', async () => {
    const licenseKey: KeyInfo = {
        well_id: 1,
        last_used_milis: 0,
        license_id: 2,
        key: 'test',
    }
    const knex = await getKnex()
    await knex('license').insert(licenseKey)
    const result = await knex('license').select()
    expect(result.length).toBe(1)
    expect(result[0].key).toBe('test')
    expect(result[0].testPerm1).toBe(0)
    expect(result[0].testPerm2).toBe(1)
})

test('get record by key', async () => {
    const result = await getLicenseRecordByKey('test')
    expect(result.well_id).toBe(1)
})

test('free key', async () => {
    await setKeyBinding('test', null)
    const result = await getLicenseRecordByKey('test')
    expect(result.well_id).toBe(null)
})

test('set key', async () => {
    await setKeyBinding('test', '25')
    const result = await getLicenseRecordByKey('test')
    expect(result.well_id).toBe(25)
})

test('insert seed and check all keys', async () => {
    const knex = await getKnex()
    await seedKeys(['4', '5', '6', '7', '8'])
    const result = await knex('license').select()
    expect(result.length).toBe(6)
})
