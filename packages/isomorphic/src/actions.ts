import {Action} from 'redux'
import * as fsa from '@local/fsa'
import * as biz from '@local/biz'
import * as activation from './activation';
import {ActivationState} from './activation';

const clientFactory = fsa.actionCreatorFactory('client', {destination: 'backend'})
const backendFactory = fsa.actionCreatorFactory('backend', {destination: 'client'})
const masterFactory = fsa.actionCreatorFactory('master', {destination: 'client'})
const slaveFactory = fsa.actionCreatorFactory('slave', {destination: 'client'})

export type AuthRequestPayload = {
    login: string
    password: string
}

export type AuthSuccessPayload = {
    snapshotId: string
    authKey?: string
    userId: string
}

const client = {
    // requreast auth , take credentials from the state and ask the server
    authRequest: clientFactory<{ login?, password? } | undefined>('authRequest'),
    logout: clientFactory('logout'),
    push: clientFactory<Action[]>('push'),
    subscribe: clientFactory<{ snapshotId: string }>('subscribe'),
    factory: clientFactory,
    requestActivation: clientFactory<{ key: string, masterAddress: string }>('requestActivation'),
}

const backend = {
    initialized: backendFactory('initialized'),
    reloadState: backendFactory('realoadState'),
    seed: backendFactory<biz.SeedConfig | undefined>('seedRequest'),
    seedCompleted: backendFactory('seedCompeleted'),
    config: backendFactory<any>('config'),
    authSuccess: backendFactory<AuthSuccessPayload>('authSuccess'),
    authFailed: backendFactory<{ error: string }>('authFailed'),
    factory: backendFactory,
    publicMeta: backendFactory<Partial<PublicMeta>>('publicMeta'),
}

export type PublicMeta = {
    isMaster: boolean,
    name: string,
    version: string,
    activation: ActivationState
}


const master = {
    push: masterFactory<Action[]>('push'),
    factory: masterFactory,
}

const slave = {
    push: slaveFactory<Action[]>('push'),

    factory: slaveFactory,
}

export {
    client,
    backend,
    master,
    slave,
    activation
}
