import * as path from 'path'
import * as R from 'ramda'
import {mergeDeepLeft} from 'ramda'
import * as fd from '@local/file-data'

const isPromise = obj =>
    !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'

/**
 * Call back function, to invoke when config is changed.
 * Configuration could take some time, so configurator must return promise
 */
export type Confgigurator<C> = (config: C) => Promise<any> | any

export default (fileName: string) =>
    <C>(configurator: Confgigurator<C>) =>
        (defaultConfig: Partial<C> = {}) => {

            const fileData = getConfigRepository<C>(fileName, defaultConfig)

            let isReady = false

            const resolvers: Function[] = []
            let result

            const rebuild = async () => {

                isReady = false
                const actualConfig = fileData.getData()
                const resultConfig = R.mergeDeepRight(defaultConfig, actualConfig)
                result = configurator(resultConfig)
                if (isPromise(result))
                    await result

                isReady = true
                resolvers.forEach(r => r(result))
                resolvers.length = 0
            }

            rebuild()

            // @ts-ignore
            fileData.signalChange.add(rebuild)

            return () =>
                new Promise(r =>
                    isReady
                        ? r(result)
                        : resolvers.push(r)
                )
        }


export function getConfigRepository<T>(configPath, defaultConfig: Partial<T> = {}): fd.FileDataRepository<T> {
    const filePath = path.join('config', configPath + '.json')

    return fd.fileDataRepository(filePath, defaultConfig, true)
}
