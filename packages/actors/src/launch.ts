import {ChildProcess, fork} from 'child_process'
import prepareArgs from './prepareArgs'
import {AssociativeArray} from '@local/utils'

/**
 * Decorate ChildProcess with new type of events and listener bindings
 */
export async function launch(
    modulePath: string,
    forward: boolean = false,
    argsExtra: AssociativeArray<string> = {}
): Promise<ChildProcess> {

    let {args, execArgv} = await prepareArgs(process, forward, argsExtra)

    return fork(modulePath, args, {execArgv})
}
