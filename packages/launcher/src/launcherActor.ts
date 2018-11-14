import {call} from 'redux-saga/effects'
/*import {act} from '../../shared/actions/index'
import {updaterActions} from '../../shared/actions/updaterActions'*/
import prepareArgs from './prepareArgs'
import {ChildProcess, exec, execFile, fork, spawn, spawnSync} from 'child_process'
import {AssociativeArray, sleep} from '@local/utils'

const respawn = async (
    argsExtra: AssociativeArray<string> = {}
): Promise<any/*ChildProcess*/> => {

    const {args, execArgv} = await prepareArgs(process, true, argsExtra)

    const execCombined = [__dirname + '/../index.js ', ...args.concat(execArgv)]

    console.log(execCombined)

    return fork(__dirname + '/../index.js ', args, {execArgv})
}

export function* launcherActor() {
    while (true) {
        console.log('HI there !')
        //const serviceActorBody = path.join(__dirname, '../', 'serviceActor.js')
        //const serviceActor = yield call(runActor, serviceActorBody)
        //const serviceTask = yield serviceActor.run()
        //const updaterActor = yield call(runActor,  path.join(__dirname, '../', 'updater/', 'updaterActor.js'))

        // fork reader from actor
        //const updaterTask = yield updaterActor.run()

        /*  const action = yield serviceActor.take(isType(act.service.updateRequested))

          yield updaterActor.put(action)
          yield updaterActor.take(isType(updaterActions.updated))

          yield cancel(serviceTask)
          yield cancel(updaterTask)

          console.log('launcher get a message about successfully update', action)

          serviceActor.kill()
          updaterActor.kill()
  */
        yield call(sleep, 999999)
    }
}
