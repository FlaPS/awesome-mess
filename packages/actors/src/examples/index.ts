import {startTopProcessActor} from '../actor'
import * as path from 'path'

const logger = console

const pingActorPath = path.join(__dirname, 'pingActor.js')

logger.log('launch ping actor')

startTopProcessActor(pingActorPath, true, 'rootActor', true)
    .then(
        () => logger.log('pingActor Launched')
    )
