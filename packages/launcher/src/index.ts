import {startTopProcessActor} from '@local/actors'
import {launcherActor} from './launcherActor'

startTopProcessActor(launcherActor, false, 'rootActor', true)

