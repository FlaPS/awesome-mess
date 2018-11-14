import {WELL, WellSpec} from '../general/Well'
import {PROJECT, ProjectSpec} from '../general/Project'
import * as R from 'ramda'
import {GROUP} from '../general/Group'
import {KeyOrSpec} from '../core/Scheme'
import {arrify, Arrify} from '@local/utils'


const byWell = (keyOrSpec: Arrify<KeyOrSpec<WellSpec>>) => {
    const ids = arrify(keyOrSpec).map(WELL.keyBuilder.buildKey)
    return GROUP.whereProp('wellIds')(wells => R.intersection(ids, wells).length > 0)
}

const byProject = (keyOrSpec: Arrify<KeyOrSpec<ProjectSpec>>) => {
    const ids = arrify(keyOrSpec).map(PROJECT.keyBuilder.buildKey)
    return GROUP.where({
        projectIds: R.compose(R.complement(R.isEmpty), R.intersection(ids)),
    })
}

export default {
    byWell,
    byProject,
}
