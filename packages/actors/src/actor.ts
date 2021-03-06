import {cancel, fork, put, PutEffect, take as sagaTake, takeEvery} from 'redux-saga/effects'
import {Action, applyMiddleware, compose, createStore, Store as ReduxStore} from 'redux'
import createSagaMiddleware, {Channel, eventChannel, Task} from 'redux-saga'


import fileData from '@local/file-data'
import launch from './launch'

import {getLogger} from '@local/logger'
import actions from './actions'
import {isType} from '@local/fsa'
import {ChildProcess} from 'child_process'
import {actorSystemConfig} from './config'

export {PutEffect}

interface Store<T> extends ReduxStore<T> {
    runSaga(saga: any, ...args): any
}

const distDirectory = fileData.getDistPath()

const shortid = require('shortid')
const actorPath = __filename
const logger = getLogger('ACTOR_SYSTEM')

export interface Actor {
    /**
     * Put action to actor
     * @param action
     */
    put: (action: any) => any

    /**
     * Unique id of actor, by default generated by shortid library
     */
    actorId: string

    /**
     * Is current action sent by this actor ?
     * @param action
     */
    isActor: (action: Action) => boolean

    /**
     * Take unwrapped action from actor
     * @see redux-saga/effects/take
     * @return effect creator
     */
    take: Function

    /**
     * Channel, to control actor's output manually
     */
    channel: Channel<any>

    /**
     * Task to read actions from actor
     */
    readerTask?: Task,

    /**
     * Run actor and create readerTask
     */
    run: any

    /**
     * Stop actor lifecycle
     */
    kill: Function
}


/**
 * Send action to parent actor, make one available to take
 * @param action
 */
export function* out(action) {
    yield put(actions.output(action, {}))
}

const inputTaker = actorId => pattern => action => {
    if (action.meta && actorId === action.meta.actorId && isType(actions.input)(action)) {
        const input = action.payload

        if (typeof pattern === 'string' && input.type === pattern)
            return true

        if (typeof pattern === 'function' && pattern(input))
            return true
    }

    return false
}

export async function runInMemoryActor<S>(actorBody: any, forked: Boolean = false, actorId: string = shortid.generate(), isTopLevel: boolean = false): Promise<Actor> {

    logger.log('actor body is', typeof actorBody, actorBody)

    if (typeof actorBody === 'string') {
        const fullActorPath = actorBody
        logger.log('launch actor from here', fullActorPath)
        actorBody = require(fullActorPath).default
    }

    const sagaMiddleware = createSagaMiddleware()

    let result = actorBody
    if (typeof actorBody === 'function')
        result = actorBody()

    const store: Store<S> = typeof result['throw'] === 'function' ?
        createStore(
            state => state,
            {},
            compose(
                applyMiddleware(sagaMiddleware)
            )
        )
        :
        result

    const isActor = action =>
        action.meta.actorId === actorId

    if (!store.runSaga)
        store.runSaga = sagaMiddleware.run

    if (store !== result)
        store.runSaga(actorBody)

    const channel = eventChannel(emit => {

            const task = store.runSaga(function* emitter() {
                yield takeEvery(isType(actions.output), function* (action: any) {
                    action.meta.actorId = actorId
                    if (forked) {
                        process.send(action)
                    }
                    else {
                        emit(action)
                    }
                })
            })

            return () => {
                task.cancel()
                if (readerTask) {
                    readerTask.cancel()
                    readerTask = undefined
                }
            }
        }
    )


    const reader = function* reader() {
        while (true) {
            const action = yield sagaTake(channel)
            action.type = actions.input.type
            yield put(actions.input(action.payload, {actorId}))

        }
    }

    let readerTask

    const take = function* (pattern) {
        const action = yield sagaTake(inputTaker(actorId)(pattern))
        return action.payload
    }

    if (forked) {
        process.on('message', store.dispatch)
    }

    const run = () => fork(reader)

    const kill = () => {
        if (forked)
            process.exit(0)

        else
            channel.close()
    }

    return {
        put: store.dispatch,
        isActor,
        actorId,
        channel,
        readerTask,
        take,
        run,
        kill,
    }
}


export async function runIPCActor(actorBody: string, forward: boolean = false, actorId: string = shortid.generate()): Promise<Actor> {

    const child: ChildProcess = await launch(actorPath, forward, {['--actor']: actorBody, ['--actorId']: actorId})

    await childInitialize(child)

    let channelEmit

    const channel = eventChannel(emit => {
            channelEmit = action => {
                emit(actions.output(action, {actorId}))
            }

            child
                .on('message', message => {
                    logger.log('emit to channel from forked child', message)
                    emit(message)
                })
                .on('disconnect', () =>
                    channelEmit(actions.disconnected())
                )
                .on('exit', () =>
                    channelEmit(actions.disconnected())
                )
                .on('error', () => {
                    channelEmit(actions.disconnected())
                })
                .on('close', () => {
                    channelEmit(actions.disconnected())
                })

            return () => {
                if (child.connected)
                    child.kill()
                child.removeAllListeners()

                if (readerTask) {
                    readerTask.cancel()
                    readerTask = undefined
                }
            }
        }
    )

    const reader = function* reader() {
        while (true) {
            const action = yield sagaTake(channel)
            action.type = actions.input.type
            yield put(action)
        }
    }

    let readerTask

    const take = function* (pattern) {
        readerTask = yield fork(reader)
        const action = yield sagaTake(inputTaker(actorId)(pattern))
        yield cancel(readerTask)
        return action.payload
    }

    const isActor = action =>
        action.meta.actorId === actorId

    const putToChild = action => {
        if (child.connected)
            child.send(action)
        else {
            logger.log('child disconnected')
            channelEmit(actions.disconnected())
        }
    }

    const run = () => fork(reader)
    const kill = () => child.kill()
    return {
        put: putToChild,
        isActor,
        actorId, channel,
        run,
        take,
        kill,
    }
}


const childInitialize = async (child: ChildProcess): Promise<any> =>
    new Promise<boolean>(resolve =>
        child.once('message', resolve)
    )


export async function runActor(actorBody: any,
                               forward: boolean = false,
                               inMemory: boolean = false,
                               actorId: string = shortid.generate()): Promise<Actor> {

    if (typeof inMemory === 'undefined') {
        const cfg = actorSystemConfig.getData()

        const actorData = cfg.actors.filter(act => act.path === actorBody)

        inMemory = actorData.length ? actorData[0].inMemory : true
    }
    if (typeof forward === 'undefined') {
        const cfg = actorSystemConfig.getData()

        const actorData = cfg.actors.filter(act => act.path === actorBody)

        forward = actorData.length ? actorData[0].forward : false
    }
    return inMemory ?
        runInMemoryActor(actorBody, false, actorId)
        :
        runIPCActor(actorBody, forward, actorId)

}


/**
 * Self in memory run
 * @returns {Promise<void>}
 */
export const startTopProcessActor = async (actorBody, forked = false, actorId = 'rootActor', isTopLevel: boolean = false) =>
    runInMemoryActor(actorBody, forked, actorId, isTopLevel)


if (argv.actor) {
    startTopProcessActor(argv.actor, true, argv.actorId, false)
    if (process.send)
        process.send(actions.initialized())
}
