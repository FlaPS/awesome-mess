import {AssociativeArray, isBackend} from '@local/utils'
import {mergeDeepLeft} from 'ramda'

let getConfigRepositry

export type LogWriter = (...optionalParams: any[]) => void

let transport: any = console

export type Logger = {
    debug: LogWriter
    log: LogWriter
    info: LogWriter
    warn: LogWriter
    error: LogWriter
}

const namespaces: Map<string, Logger> = new Map<string, Logger>()

export type LoggerConfig = {
    logToFile: boolean
    loggers: AssociativeArray<number>
}


export enum LogLevel {DEBUG, LOG, INFO, WARN, ERROR}

export let defaultLoggerConfig: LoggerConfig = {
    logToFile: true,
    loggers: {
        default: 0,
    },
}

const setUpBackendLogger = (config: Partial<LoggerConfig>) => {
    getConfigRepositry = eval('req' + 'uire' + '("@local/config").getConfigRepository')

    if (config.logToFile)
        transport = eval('req' + 'uire' + '("./back/fileTransport").createFileTransport()')

    else
        transport = console

    defaultLoggerConfig = mergeDeepLeft(config, getConfigRepositry('logger').getData())
}

if (isBackend)
    setUpBackendLogger(defaultLoggerConfig)

const decorateWriter = namespace => level => writer => {
    return (...args) => {

        const space = (defaultLoggerConfig.loggers[namespace] !== undefined) ? namespace : 'default'
        const settingsValue = defaultLoggerConfig.loggers.hasOwnProperty(space) ?
            defaultLoggerConfig.loggers[space]
            :
            defaultLoggerConfig.loggers['default']

        if (settingsValue <= level)
            switch (level) {
                case 0 :
                    const fnc = (transport.debug ? transport.debug : transport.log)
                    fnc(namespace, args.map(JSON.stringify as any).join(', '))
                    break

                case 2 :
                    transport.info(namespace, args.map(JSON.stringify as any).join(', '))
                    break
                case 3 :
                    transport.warn(namespace, args.map(JSON.stringify as any).join(', '))
                    break
                case 4 :
                    transport.error(namespace, args.map(JSON.stringify as any).join(', '))
                    break
                case 1 :
                default :
                    transport.log(namespace, args.map(JSON.stringify as any).join(', '))
                    break
            }
    }
}

const createLogger = (transport: Logger) => (namespace: string) =>
    ({
        debug: decorateWriter(namespace)(0)(transport.debug),
        log: decorateWriter(namespace)(1)(transport.log),
        info: decorateWriter(namespace)(2)(transport.info),
        warn: decorateWriter(namespace)(3)(transport.warn),
        error: decorateWriter(namespace)(4)(transport.error),
    })


export const getLogger = (namespace: string): Logger =>
    namespaces.has(namespace) ?
        namespaces.get(namespace)
        :
        namespaces.set(namespace, createLogger(transport)(namespace)).get(namespace)
