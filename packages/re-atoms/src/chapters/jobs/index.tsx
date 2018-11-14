import * as React from 'react'
import makeRoute from '../makeRoute'
import PageAll from './PageAllJobs'
import JobPage from './JobPage'
import Library from '../../styles/SVGLibrary'
import RoutedPage from '../../smart/RoutedPage'
import {JobSpec} from '@local/biz'

class Chapter extends RoutedPage<any> {
    render() {
        return this.renderChildRoutes()
    }
}


export default {
    index: makeRoute({
            path: '/app/jobs',
            innerIndex: '/app/jobs/all',
            title: 'Мероприятия',
            label: 'Мероприятия',
            icon: <Library.Hamburger/>,
        },
        Chapter
    ),
    jobsList: {
        index: makeRoute({
                path: '/app/jobs/all',
            },
            PageAll
        ),
    },
    job: {
        index: makeRoute({
                path: '/app/jobs/job/:rigId/:jobId',
                get: (props: JobSpec) => {
                    return `/app/jobs/job/${props.rigId}/${props.jobId}/`
                },

            },
            JobPage
        ),
    },
}
