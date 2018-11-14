import findNextFreePort from '@local/free-port'
import {AssociativeArray} from '@local/utils'

type LaunchArgs = {
    args: string[]
    execArgv: string[]
}

/**
 * Copy all execArgs of parent process, and launch child with same with replace debug port
 * @param process
 * @param forward
 * @returns {Promise<{args: string[], execArgv: string[]}>}
 */
export default async (process: NodeJS.Process, forward: boolean = true, argsExtra: AssociativeArray<string> = {}): Promise<LaunchArgs> => {
    const args = process.argv.slice(2)
    const execArgv = process.execArgv.concat()

    for (let i = 0; i < execArgv.length; i++) {
        const [option, value] = execArgv[i].split('=')

        if (option === '--inspect-brk') {
            execArgv.splice(i, 1)
            i--
        }
    }

    if (forward)
        execArgv.push('--inspect-brk=' + await findNextFreePort(Number(25000)))

    for (const k in argsExtra)
        if (args.indexOf(k) !== -1)
            args.splice(args.indexOf(k), 2)


    for (const k in argsExtra)
        args.push(k, argsExtra[k])


    console.log('ARGS ', args, execArgv)

    return {args, execArgv}
}
