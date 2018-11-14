import {setDataPath} from '@local/file-data'
import {eventStoreConfigFileName, serviceConfigFileName} from '../constants'
import {getConfigRepository} from '@local/config'
import {closeServer, defaultServiceConfig} from '../server/restServer'
///import {configureFrontendStore} from '../packages/re-atoms/src/store/configureStore'
import {EventStoreConfig} from '../knexConnection'
import * as ip from 'ip'
import {backendSaga} from '../sagas/backendSaga'
import getBackendStore from '../getBackendStore'
import {call, select, take} from 'redux-saga/effects'
import * as iso from '@local/isomorphic'
import {isType} from '@local/fsa/dist'
import * as keysotre from '../keystore'
import axios from 'axios'
import {delay} from 'redux-saga'

beforeEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000
})

const logger = console

const masterDataFolder = 'test-master'

const serviceCfg = {
    httpAddress: ip.address(),
    httpPort: 12002,
    reloadState: false,
    isMaster: true,
    runSeed: true,
}

const eventStoreCfg = {
    connection: {
        database: 'rs_test_master',
    },
}
const masterGateway = serviceCfg.httpAddress + ':' + serviceCfg.httpPort
const api = iso.slaveRestClient({gateway: masterGateway})

let masterStore
let masterSagaTask


test('create test master service config, and read one', () => {
        // switch to test master folder
        setDataPath(masterDataFolder)
        // defined into run configuration
        // create default master config, with no reload state. Seed one at start

        const serviceFD = getConfigRepository<typeof defaultServiceConfig>(serviceConfigFileName, serviceCfg)
        expect(serviceFD.getData().httpAddress)
            .toEqual(serviceCfg.httpAddress)

        // create event store config, with test data base for master
        const eventStoreFD = getConfigRepository<EventStoreConfig>(eventStoreConfigFileName, eventStoreCfg)

        expect(eventStoreFD.getData().connection.database)
            .toEqual(eventStoreCfg.connection.database)

        // configure empty client
        // const client = configureFrontendStore()
    }
)


beforeAll(() =>
    masterStore = getBackendStore()
)


afterAll(async () => {
        if (masterSagaTask)
            masterSagaTask.cancel()
        await closeServer()
    }
)

it(' run service and get dummy state', async () => {
    masterSagaTask = masterStore.runSaga(backendSaga, serviceCfg)

    return new Promise((resolve, reject) => {
        masterStore.runSaga(function* () {


            const action = yield take(isType(iso.actions.backend.seedCompleted))

            logger.log('master initialized', action)

            const url = 'http://' + serviceCfg.httpAddress + ':' + serviceCfg.httpPort + '/api/clientState'
            const result = yield call(axios as any, {
                method: 'get',
                url,
            })

            expect(result.data).toBeDefined()

            const state = yield select()

            resolve()
        })
    })
})


test('seed well keys', async () => {
    await keysotre.clearKeys()
    await keysotre.seedKeys(['1', '2', '3'])
    expect((await keysotre.getLicenseRecordByKey('w1')).well_id).toEqual(1)
})

test('create and successfully active well with id 1', async () => {
    const result = await api.activate({key: 'w1', masterAddress: masterGateway})
    expect(result).toMatchObject({wellId: '1', key: 'w1', status: 'success'})
})

test('request wrong gateway', async () => {
    const api = iso.slaveRestClient({gateway: 'example.domain.com'})
    const result = await api.activate({key: 'w999', masterAddress: masterGateway})
    expect(result).toMatchObject({status: 'error'})
})


test('request wrong key', async () => {
    const result = await api.activate({key: 'asd', masterAddress: masterGateway})
    expect(result).toMatchObject({status: 'fail', keyError: 'keyNotFound'})
})

test('request key without binded well', async () => {
    const result = await api.activate({key: 'w9999999', masterAddress: masterGateway})
    expect(result).toMatchObject({status: 'fail', keyError: 'keyIsNotBinded'})
})
/*

import getFrontendStore from '../rs-front-store'
import * as FrontStore from '../rs-front-store'
*/
/*let front1 = getFrontendStore()


test('set credentilas to front1', () => {
        const data = {login: 'vasya', password: 'pupkin'}
        front1.dispatch(FrontStore.credentials.actions.setCredentials(data))
        expect(front1.getState().credentials).toEqual(data)
    }
)
*/