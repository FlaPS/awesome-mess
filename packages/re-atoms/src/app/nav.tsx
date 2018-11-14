import * as React from 'react'
import {AppFrame} from './AppFrame'
import Library from '../styles/SVGLibrary'
import {Redirect} from 'react-router'
import {chapterReferences} from '../chapters/reference/ChapterReferences'
import PageDrillRigsList from '../chapters/chapterDrillRigs/drillRigs/PageDrillRigsList'
import PageDrillRig from '../chapters/chapterDrillRigs/drillRig/PageDrillRig'
import WizardDrillRig from '../chapters/chapterDrillRigs/createDrillRig/WizardDrillRig'
import ChapterDrillRigs from '../chapters/chapterDrillRigs/chapterDrillRigs'
import LoginPage from '../chapters/LoginPage'
import ActivationPage from '../chapters/ActivationPage'
import {findRouteMatch} from './navHelpers'
import {flatten, omit, values} from 'ramda'
import accessNav from '../chapters/access/accessNav'
import wellsNav from '../chapters/chapteWells/wellsNav'
import jobNav from '../chapters/jobs/'
import reportNav from '../chapters/reports/'

const auth = {
    index: {
        path: '/auth',
        component: LoginPage,
    },
}
const activation = {
    index: {
        path: '/init',
        component: ActivationPage,
    },
}

const drillRig = {
    index: {
        component: PageDrillRig,
        path: '/app/chapterDrillRigs/drillRig/:drillRigId',
        get: value => '/app/chapterDrillRigs/drillRig/' + value.drillRigId,
        title: 'Буровая установка',
    },
}

const drillRigs = {
    index: {
        component: PageDrillRigsList,
        path: '/app/chapterDrillRigs/list',
        title: 'Буровые установки',
    },
}

const createDrillRig = {
    index: {
        component: WizardDrillRig,
        path: '/app/chapterDrillRigs/createDrillRig',
        title: 'Создание новой буровой установки',
    },
}

const chapterDrillRigs = {
    index: {
        component: ChapterDrillRigs,
        path: '/app/chapterDrillRigs',
        innerIndex: '/app/chapterDrillRigs/list',
        icon: <Library.Drill/>,
        label: 'Буровые установки',
        title: 'Управление буровыми установками',
    },
    drillRigs,
    createDrillRig,
    drillRig,
}

const app = {
    index: {
        component: AppFrame,
        path: '/app',
    },
    access: accessNav,
    chapterWells: wellsNav,
    chapterReferences,
    chapterDrillRigs,
    /*
    anniversary,
    */
    jobs: jobNav,
    reports: reportNav,

}


const nav = {
    app,
    auth,
    activation,
    index: {
        component: () => <Redirect from='/' to='/app/access'/>,
        path: '/',
    },
}

const computeAllRoutes = (routes, flattenRoutes = []) => {
    const index = routes.index
    const otherRoutes = omit(['index'], routes)
    const subRoutes = values(otherRoutes)

    return flatten(subRoutes.map(s => computeAllRoutes(s))).concat(index ? [index] : [])
}

const flatRoutes = computeAllRoutes(nav)
// console.log('allRoutes', flatRoutes)

// const getRouteBypath = path =>

window['flatRoutes'] = flatRoutes


export const getMatchedRoute = path =>
    flatRoutes.filter(r => r.path === findRouteMatch(nav)(path).path)[0]

window['getMatchedRoute'] = getMatchedRoute

export const getRouteMatch = path => {
    const match = findRouteMatch(nav)(path)
    const route = flatRoutes.filter(r => r.path === match.path)
    return {
        route,
        match,
    }
}

export const getCurrentRoutePattern = () =>
    getRouteMatch(window.location.pathname).match.path

window['getRouteMatch'] = getRouteMatch

window['findRouteMatch'] = path => findRouteMatch(path)(nav)

export default nav

