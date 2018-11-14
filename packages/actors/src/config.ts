import {FileDataRepository, getConfigRepository} from '@local/file-data'

/**
 * Has no affect on the root actor,
 * first one which forks others as a result of saga calculations
 */
export interface ActorConfig {

    /** actorBody path should export default on of next options:
     * generator i.e. Saga,
     * or storeConfigurator as regular sync function
     * configured store object
     *
     */
    path: string

    /**
     * is this actor run in save V8 as a parent actor
     * @default true
     */
    inMemory?: boolean


    /**
     * in case of independend V8 instance i.e. inMemory = false,
     * this option set up any free port as debug port for forked process
     * @default false
     */
    forward?: boolean
}

export type ActorSystemConfig = {

    actors: ActorConfig[]

}

export {
    FileDataRepository
}

export const actorSystemConfig = getConfigRepository<ActorSystemConfig>('actors', {actors: []})
