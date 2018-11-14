// tslint:disable:no-var-requires
export const cliArgv: {
    data: string
    development?: boolean
    actor?: string
    actorId?: string
} = require('yargs')
    .default('data', 'slave1')
    .default('--development', false)
    .argv

