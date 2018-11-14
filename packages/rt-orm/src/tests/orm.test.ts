import {getDBTableName, initDb} from '../initDb'
import {ResetAction, UpdateAction} from '../ORM'
import {getKnex, initializeKnex} from '../knexConnection'
import {BizAction, defaultBizState, schemes} from '@local/biz'
import {toIndexedArray} from '@local/utils'
import {concat, difference} from 'ramda'

jest.setTimeout(100000)

const testConfig = {
    client: 'mysql',
    connection: {
        host: process.env.NODE_ENV === 'test_docker' ? 'mysql' : '127.0.0.1',
        user: 'root',
        password: 'tetraroot',
        multipleStatements: true,
        database: 'rt_orm_test',
    },
}

declare const test: any
declare const expect: any
declare const afterAll: any
declare const beforeAll: any
declare const jest: any

const getManyToManyTablesNames = (): Array<string> => {
    const names = []
    toIndexedArray(schemes)
        .forEach(scheme =>
            Object.keys(scheme.properties)
                .forEach(propName => {
                    if (scheme.properties[propName].type === 'arrayOf') {
                        const firstSchemeName = scheme.name.toLowerCase()
                        const secondSchemeName = schemes[scheme.properties[propName].schemeName].name.toLowerCase()
                        names.push(`${firstSchemeName}_set_${secondSchemeName}`)
                    }
                })
        )

    return names
}

beforeAll(async done => {
    try {
        //  console.log('initing knex test')
        await initializeKnex(testConfig)
        await initDb()
    } catch (e) {
        //  console.log(`error when installing test db: ${e.toString()}`)
        process.exit()
    } finally {
        done()
    }
})

test('tables created properly', async () => {
    let schemeNames = []
    for (const scheme in schemes) {
        if (schemes.hasOwnProperty(scheme))
            schemeNames.push(getDBTableName(schemes[scheme].name))
    }

    schemeNames = concat(schemeNames, getManyToManyTablesNames())
    let tablesInDB =
        await getKnex().raw(
            `SELECT table_name from information_schema.tables WHERE table_schema = '${testConfig.connection.database}';`
        )
    tablesInDB = tablesInDB[0].map(data => data['table_name'])
    expect(difference(tablesInDB, schemeNames).length).toBe(0)
})

test('insert user', async () => {
    const userAction = {
        type: 'biz/USER/ADDED',
        payload: {
            id: '0',
            patch: {
                userId: '0',
                login: 'test',
                password: 'test',
                firstName: 'test',
                lastName: 'test',
                email: 'test',
            },
            userId: '0',
        },
    }

    const userAction2 = {
        type: 'biz/USER/ADDED',
        payload: {
            id: '1',
            patch: {
                userId: '1',
                login: 'test1',
                password: 'test1',
                firstName: 'test1',
                lastName: 'test1',
                email: 'test1',
            },
            userId: '0',
        },
    }

    await UpdateAction(userAction)
    await UpdateAction(userAction2)
    const users = await getKnex()('user').select()
    expect(users.length).toBe(2)
})

test('insert role', async () => {
        const roleAction = {
            type: 'biz/ROLE/ADDED',
            payload: {
                id: '0',
                patch: {
                    roleId: '0',
                    name: 'test',
                    color: 'test',
                },
                userId: '0',
            },
        }
        await UpdateAction(roleAction)
        const roles = await getKnex()('role').select()
        expect(roles.length).toBe(1)
    }
)

test('remove role', async () => {
    const removeAction = {
        type: 'biz/ROLE/REMOVED',
        payload: {
            id: '0',
            patch: {
                removed: true,
            },
        },
    }
    await UpdateAction(removeAction)
    const roles = await getKnex()('role').select()
    expect(roles[0]['removed']).toBe(1)
})

test('set role to user', async () => {
    const userUpdate: BizAction<schemes.USER> = {
        type: 'biz/USER/UPDATED',
        payload: {
            id: '0',
            patch: {
                roleIds: ['0'],
            },
        },
    }

    await UpdateAction(userUpdate)
    const userRoles = await getKnex()('user_set_role').select()
    expect(userRoles.length).toBe(1)
})

test('remove user role', async () => {
    const userUpdate: BizAction<schemes.USER> = {
        type: 'biz/USER/UPDATED',
        payload: {
            id: '0',
            patch: {
                roleIds: [],
            },
        },
    }

    await UpdateAction(userUpdate)
    const userRoles = await getKnex()('user_set_role').select()
    expect(userRoles.length).toBe(0)
})

test('populate user', async () => {
    const populateUserAction = {
        type: 'biz/USER/POPULATED',
        payload: {
            id: '0',
            patch: [
                {login: 'test1'},
                {password: 'user2'},
            ],
            userId: '0',
        },
    }
    await UpdateAction(populateUserAction)
    const users = await getKnex()('user').select()
    expect(users[0].login).toBe('test1')
    expect(users[0].password).toBe('user2')
})

test('populate 2 users with single patch', async () => {
    const populateUserAction = {
        type: 'biz/USER/POPULATED',
        payload: {
            id: ['0', '1'],
            patch: {password: 'user2'},
            userId: '0',
        },
    }

    await UpdateAction(populateUserAction)

    const users = await getKnex()('user').select()
    expect(users[0].password).toBe('user2')
    expect(users[1].password).toBe('user2')
})

test('populate 2 users with 2 patches', async () => {
    const populateManyWithMany = {
        type: 'biz/USER/POPULATED',
        payload: {
            id: ['0', '1'],
            patch: [{login: 'user0'}, {login: 'user1'}],
            userId: '0',
        },
    }

    await UpdateAction(populateManyWithMany)
    const users = await getKnex()('user').select()
    expect(users[0].login).toBe('user0')
    expect(users[1].login).toBe('user1')
})


test('reset all state', async () => {
    let users = await getKnex()('user').select()
    expect(users.length).toBe(2)
    let roles = await getKnex()('role').select()
    expect(roles.length).toBe(1)
    await ResetAction({biz: {...defaultBizState}})
    users = await getKnex()('user').select()
    roles = await getKnex()('role').select()
    expect(users.length).toBe(0)
    expect(roles.length).toBe(0)
})

afterAll(async done => {
    try {
        await getKnex().raw(`DROP DATABASE IF EXISTS ${testConfig.connection.database};`)
        await getKnex().destroy()
        // console.log('knex destroyed')
    } catch (e) {
        // console.log(e.toString())
    } finally {
        done()
    }
})
