import * as React from 'react'
import PageAssignWellProject from './projects/PageAssignWellProject'
import ChapterWells from './ChapterWells'
import WizardWell from './createWell/WizardWell'
import WizardWellProject from './createProject/WizardWellProject'
import PageWellDetails from './wells/PageWellDetails'
import PageWellsList from './wells/PageWellsList'
import PageProject from './projects/PageProject'
import PageProjectsList from './projects/PageProjectsList'
import {PROJECT, sel, WELL} from '@local/biz'
import Library from '../../styles/SVGLibrary'

const wells = {
    index: {
        component: PageWellsList,
        path: '/app/chapterWells/wells',
        title: 'Управление скважинами',
        label: 'Скважины',
    },
}

const well = {
    index: {
        component: PageWellDetails,
        path: '/app/chapterWells/well/:wellId',
        get: value => '/app/chapterWells/well/' + value.wellId,
        title: ({wellId}) => {
            const well = sel(WELL).byKey(wellId)()
            return sel(WELL).getFullName(well)()
        },
    },
}

const addWell = {
    index: {
        component: WizardWell,
        path: '/app/chapterWells/addWell',
        title: 'Создание новой скважины',
    },
}


const project = {
    index: {
        component: PageProject,
        path: '/app/chapterWells/project/:projectId',
        get: value => '/app/chapterWells/project/' + value.projectId,
        title: ({projectId}) => 'Группа скважин ' + sel(PROJECT).getFullName(projectId)(),
    },
}


const addWellProject = {
    index: {
        component: WizardWellProject,
        path: '/app/chapterWells/addWellProject',
        title: 'Новая группа скважин',
    },
}


const projectsList = {
    index: {
        component: PageProjectsList,
        path: '/app/chapterWells/projectsList',
        title: 'Скважины',
        label: 'Группы скважин',
    },

}

const assignProject = {
    index: {
        path: '/app/chapterWells/assignProject/:projectId',
        get: value => '/app/chapterWells/assignProject/' + value.projectId,
        title: 'Добавление скважин в группу',
        component: PageAssignWellProject,
    },
}

export default {
    index: {
        component: ChapterWells,
        path: '/app/chapterWells',
        icon: <Library.Well/>,
        label: 'Скважины',
        innerIndex: '/app/chapterWells/wells',
        title: 'Управление скважинами',
    },
    wells,
    well,
    projects: projectsList,
    addWell,
    project,
    addWellProject,
    assignProject,
}
