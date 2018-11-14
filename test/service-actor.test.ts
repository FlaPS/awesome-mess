import {JOB} from '../packages/biz'
import {fileDataRepository, setDataPath} from '../packages/file-data/src'
import {eventStoreConfigFileName, serviceConfigFileName} from '../packages/service-actor/src/constants'
import {getConfigRepository} from '../packages/config/src'
import {defaultServiceConfig} from '../packages/service-actor/src/server/restServer'
///import {configureFrontendStore} from '../packages/re-atoms/src/store/configureStore'
import {EventStoreConfig} from '../packages/service-actor/src/knexConnection'
import * as fs from 'fs'
import * as ip from 'ip'
import {runActor} from '../packages/actors/src'

test('sum 2 x 2 = 4', () =>
    expect(2 + 2).toEqual(4)
)

const masterDataFolder = 'test-master'
const serviceCfg = {
    httpAddress: ip.address(),
    httpPort: 12002,
    reloadState: false,
}

const eventStoreCfg = {
    connection: {
        database: 'rs_test_master',
    },
}

test('create test master service config, and read one', () => {
        // switch to test master folder
        setDataPath(masterDataFolder)
        // create default master config, with no reload state. Seed one at start

        const serviceFD = getConfigRepository<typeof defaultServiceConfig>(serviceConfigFileName, serviceCfg)
        expect(serviceFD.getData())
            .toEqual(serviceCfg)

        // create event store config, with test data base for master
        const eventStoreFD = getConfigRepository<EventStoreConfig>(eventStoreConfigFileName, eventStoreCfg)

        expect(eventStoreFD.getData())
            .toEqual(eventStoreCfg)

        // configure empty client
        // const client = configureFrontendStore()
    }
)


let serviceProcess

import { fork, spawn } from 'child_process'
import * as iso from '../packages/isomorphic'
//import * as credentials from '../packages/re-atoms/src/store/credentials'
//import * as connection from '../packages/re-atoms/src/store/connection'
import {take} from 'redux-saga/effects'


test('launch service actor', async () => {


        serviceProcess = fork('../packages/service-actor', ['--data', masterDataFolder])
/*
        const client = configureFrontendStore()
        client.dispatch(connection.actions.gatewayChanged(serviceCfg.httpAddress + ':' + serviceCfg.httpPort))
        client.dispatch(credentials.actions.setCredentials({login: 'admin', password: '111111'}))
        client.dispatch(iso.actions.client.authRequest())

        let resolve
        let reject
        const promise = new Promise( (res, rej) => {
                resolve = res
                reject = rej
            }
        )

        client.runSaga(function* (){

            const action = yield take('*')
            console.log('first action in parallel saga action')
             

        })*/

    }
)

test('try check @local/biz scheme', () =>
    expect(JOB.create('12/11')).toBeDefined()
)
